import { Component } from '@angular/core';
import { BuymodalComponent } from '../buymodal/buymodal.component';
import { SellmodalComponent } from '../sellmodal/sellmodal.component';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import { CommonModule} from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [BuymodalComponent, SellmodalComponent, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  constructor( private http:HttpClient, public dialog: MatDialog, private homecomponent: HomeComponent){}

  portfoliocollectiondata:any[]=[];
  ticker:string='';
  currentprice:number=0;
  walletamount:number=0;
  profile:any={};
  summary:any={};
  stocksbought:boolean = false;
  stockssold:boolean = false;
  stockssoldbox:boolean=false;
  stocksboughtbox:boolean=false;
  portfolioloadingspinner:boolean=true;
  

  ngOnInit(): void {
    this.displayportfoliodata();
  }

  displaywalletamount(){
    this.http.get<any>(`http://localhost:8080/walletamount`).subscribe(amount=>{
      this.walletamount=parseFloat(amount.walletamount.toFixed(2));

    });
  }

  displayportfoliodata(){
    this.http.get<any[]>('http://localhost:8080/stocksforportfolio').subscribe((data) => {
      this.portfoliocollectiondata = data;

      console.log("watchlistdata", data);
      this.displaywalletamount();
      this.displaystockdetails();
      this.portfolioloadingspinner =false;

    });
    
  }

 

  displaystockdetails(){
    const requests = this.portfoliocollectiondata.map(item => {
      return forkJoin([
        this.http.get<any>(`http://localhost:8080/companydetailsone?q=${item.ticker}`),
        this.http.get<any>(`http://localhost:8080/companydetailstwo?q=${item.ticker}`)
      ]);
    });

    forkJoin(requests).subscribe(results => {
      results.forEach(([data1, data2], index) => {
        const item = this.portfoliocollectiondata[index];
        item.ticker = data1.ticker;
        item.profile = data1;
        item.currentprice = parseFloat(data2.c.toFixed(2));
        item.summary = data2;
      });
    });
  }

  openbuymodal(ticker:string, currentprice:number):void{
   
    const dialogref = this.dialog.open(BuymodalComponent,{
      width: '300px',
      height: '200px',
      data: {symbol:ticker, currentprice: parseFloat(currentprice.toFixed(2))},
      disableClose:true,
      position:{top:'100'}
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'buysuccess') {
        console.log('Stocks bought successfully');
        this.stocksbought = true;
        this.stocksboughtbox = true;
        setTimeout(()=>{
          this.stocksbought = false;
          this.stocksboughtbox = false;
        }, 3000);
      }
      this.displayportfoliodata();
    });

  }

  opensellmodal(ticker:string, currentprice:number):void{
   // this.displaystockdetails(symbol);
    const dialogref = this.dialog.open(SellmodalComponent,{
      width: '300px',
      height: '200px',
      data: {symbol:ticker, currentprice: parseFloat(currentprice.toFixed(2))},
      disableClose:true,
      position:{top:'100'}
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'sellsuccess') {
        console.log('Stocks sold successfully');
        const boughtstock = this.portfoliocollectiondata.find(item => item.ticker === ticker);
        if (boughtstock) {
          boughtstock.boughtsuccessfully = true;
        this.stockssold = true;
        this.stockssoldbox = true;
        setTimeout(()=>{
          this.stockssold = false;
          this.stockssoldbox = false;
        }, 3000);
      }}
    });
    this.displayportfoliodata();

  }
  

}

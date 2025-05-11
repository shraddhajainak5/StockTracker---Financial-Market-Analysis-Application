import { Component, Input, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-buymodal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './buymodal.component.html',
  styleUrl: './buymodal.component.css'
})
export class BuymodalComponent {

  
  currentprice:number=0;
  walletamount:number=0;
  canbuy:boolean=false;
  total:number=0.00;
  quantity:number=0;
  symbol:string='';
  avgcost:number=0.00;

  constructor(private http:HttpClient, public dialogref: MatDialogRef<BuymodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.symbol = data.symbol;
      this.currentprice = data.currentprice;
    }

    ngOnInit():void{
      this.displaywalletamount()

    }

    displaywalletamount(){
      this.http.get<any>(`http://localhost:8080/walletamount`).subscribe(amount=>{
        this.walletamount=parseFloat(amount.walletamount.toFixed(2));
      });

    }

    updatewalletamount(totalamount: number){
      return this.http.get<any>(`http://localhost:8080/buywalletupdate?total=${totalamount}`)

    }

  canbuystocks(){
    this.total = parseFloat((this.currentprice*this.quantity).toFixed(2));
    this.canbuy = this.quantity>0&&this.total<=this.walletamount;
    this.avgcost = this.total/this.quantity;
  }

  buystock(ticker: string, quantity: number, total: number){
  
      const data = {ticker:this.symbol,  quantity:this.quantity, total:this.total}
      console.log(data);
      this.http.get<any>(`http://localhost:8080/buysellstocks?ticker=${ticker}&newquantity=${quantity}&newtotal=${total}`).subscribe(response => {
        console.log('Added to watchlist:', response);
        this.updatewalletamount(total).subscribe(() => {
          console.log('Wallet amount updated');
          this.dialogref.close('buysuccess');
      })
      });
      
  }

  closemodal(){
    this.dialogref.close();
  }

}

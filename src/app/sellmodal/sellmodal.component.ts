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
import { BuymodalComponent } from '../buymodal/buymodal.component';

@Component({
  selector: 'app-sellmodal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  providers: [BuymodalComponent],
  templateUrl: './sellmodal.component.html',
  styleUrl: './sellmodal.component.css'
})
export class SellmodalComponent {
  currentprice:number=0;
  walletamount:number=0;
  cansell:boolean=false;
  total:number=0.00;
  quantity:number=0;
  quantitypresent:number=0;
  symbol:string='';

  constructor(private buymodalcomponent:BuymodalComponent, private http:HttpClient, public dialogref: MatDialogRef<SellmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.symbol = data.symbol;
      this.currentprice = data.currentprice;
    }
    ngOnInit():void{
      this.displaywalletamount();

    }

    displaywalletamount(){
      this.http.get<any>(`http://localhost:8080/walletamount`).subscribe(amount=>{
        this.walletamount=parseFloat(amount.walletamount.toFixed(2));
      });

    }

    updatewalletamount(totalamount: number){
      return this.http.get<any>(`http://localhost:8080/sellwalletupdate?total=${totalamount}`)

    }

  cansellstocks(){
    const ticker = this.symbol;
    this.http.get<any>(`http://localhost:8080/checkstockquantity?ticker=${ticker}`).subscribe(response => {
      this.quantitypresent = response.quantity;});
      this.total = parseFloat((this.currentprice*this.quantity).toFixed(2));
      this.cansell = this.quantity>0&&this.quantity<=this.quantitypresent;

  }

  sellstock(ticker: string, quantity: number, total: number){
  
    const data = {ticker:this.symbol,  quantity:this.quantity, total:this.total}
    console.log(data);
    this.http.get<any>(`http://localhost:8080/sellstocks?ticker=${ticker}&newquantity=${quantity}&newtotal=${total}`).subscribe(response => {
      console.log('Added to watchlist:', response);
      this.updatewalletamount(total).subscribe(() => {
        console.log('Wallet amount updated');
        this.dialogref.close('sellsuccess');
    })
    });
    
}

  closemodal(){
    this.dialogref.close();
  }



}

import { Inject, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-newscardmodal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './newscardmodal.component.html',
  styleUrl: './newscardmodal.component.css'
})
export class NewscardmodalComponent {

 dateconverted: string=''

  constructor(public modalreference: MatDialogRef<NewscardmodalComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    const timestamp = data.datetime * 1000; 
    const dateObject = new Date(timestamp);
    this.dateconverted = dateObject.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });}

  closemodalwindow():void{
    this.modalreference.close();
  }

  twitter(headline:string, url:string){
    const displaytweet=`https://twitter.com/intent/tweet?text=${encodeURIComponent(headline)}&url=${encodeURIComponent(url)}`;
    window.open(displaytweet, "_blank");
  }
  
  facebook(url:string){
    const displaypost=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(displaypost, "_blank");
  }

}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  providers:[HomeComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {
constructor(private http:HttpClient, private router:Router, private homecomponent:HomeComponent){}// private homecomponent:HomeComponent){}

presentinwatchlist:boolean=false;
watchlistloadingspinner:boolean=true;

watchlistcollectiondata:any[]=[];
ngOnInit(): void {
  this.displaywatchlistdata();
}

displaywatchlistdata(): void {
  this.http.get<any[]>('http://localhost:8080/watchlist').subscribe((data) => {
    this.watchlistcollectiondata = data;
    this.displaystockdetails();
    console.log("watchlistdata", data);
    this.watchlistloadingspinner = false;
  });
}

deletewatchlistdata(ticker: string):void{
  this.http.get<any>(`http://localhost:8080/deletewatchlist/${ticker}`).subscribe(
    () => { 
      console.log('item deleted')
      this.watchlistcollectiondata = this.watchlistcollectiondata.filter(item => item.ticker !== ticker);
  });

}

displaystockdetails() {
  const requests = this.watchlistcollectiondata.map(item => {
    return forkJoin([
      this.http.get<any>(`http://localhost:8080/companydetailsone?q=${item.ticker}`),
      this.http.get<any>(`http://localhost:8080/companydetailstwo?q=${item.ticker}`)
    ]);
  });

  forkJoin(requests).subscribe(results => {
    results.forEach(([data1, data2], index) => {
      const item = this.watchlistcollectiondata[index];
      item.ticker = data1.ticker;
      item.profile = data1;
      item.currentprice = data2.c;
      item.summary = data2;
    });
  });
}
oncardclick(ticker:string){
   //this.router.navigate(['/search', ticker]);
  

}

}



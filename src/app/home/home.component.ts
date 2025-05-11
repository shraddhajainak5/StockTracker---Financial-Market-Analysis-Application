import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged,switchMap, filter, startWith, map, tap  } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, Subscription, interval } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import * as Highcharts from 'highcharts';
import * as Highchart from 'highcharts/highstock';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NewscardmodalComponent } from '../newscardmodal/newscardmodal.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { BuymodalComponent } from '../buymodal/buymodal.component';
import { SellmodalComponent } from '../sellmodal/sellmodal.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { Options } from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { Chart } from 'angular-highcharts';
import HC_stock from 'highcharts/modules/stock';
import HighchartsStock from 'highcharts/modules/stock';
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVBP from "highcharts/indicators/volume-by-price";



IndicatorsCore(Highchart);
IndicatorZigzag(Highchart);
IndicatorVBP(Highchart);
HC_stock(Highchart);
HighchartsStock(Highcharts);





@Component({
  standalone: true,
  imports: [MatAutocompleteModule, MatOptionModule, FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatProgressSpinnerModule, MatButtonModule, MatDialogModule, NewscardmodalComponent, HttpClientModule, NgbModule, BuymodalComponent, SellmodalComponent, HighchartsChartModule ],
  
  

  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent{


  

  Highcharts: typeof Highcharts = Highcharts;
  autocompletecomp: any[] = [];
  searchControl = new FormControl();
  spinner = false;
  data1:any={};
  data2:any={};
  data3:any[]=[];
  data4:any={};
  data5:any[]=[];
  newsmodal:any[]=[];
  insighttrendsdata:any={};
  insightepsdata:any={};
  displaytotalmspr: number=0;
  finaltotalmspr:number = 0;
  displaypositivemspr:number = 0;
  displaynegativemspr:number = 0;
  displaytotalchange:number = 0;
  displaypositivechange:number = 0;
  displaynegativechange:number=0;
  stocktickersymbol : string ='';
  displaycontenttab = false;
  symbol: string='';
  market: string='';
  marketopen: boolean=false;
  lasttimestamp: string='';
  currenttimestamp: string='';
  subscription: Subscription = new Subscription();
  hourchart:Stockdata= {ticker: '', queryCount: 0, resultsCount: 0, adjusted: false, results: [], status: '', request_id: '', count: 0, next_url: ''};
  ticker:string='';
  twoyearchart: Stockdata= {ticker: '', queryCount: 0, resultsCount: 0, adjusted: false, results: [], status: '', request_id: '', count: 0, next_url: ''};
  watchlistticker:string='';
  watchlistcompanyname:string='';
  watchlistc:number=0;
  watchlistd:number=0;
  watchlistdp:number=0;
  addedtowtchlist:boolean=false;
  inwatchlist:boolean=false;
  peerticker:string='';
  totalmoneyinwallet:number=25000;
  currentprice:number=0;
  activetab: string = 'displaysummary';
  contenttab:boolean=true;
  showaddedbox = false;
  showdeletedbox=false;
  deletedfromwatchlist=false;
  stocksbought=false;
  stocksboughtbox = false;
  stockssold = false;
  stockssoldbox = false;
  inbuysellcollection:boolean=false;
  watchlistcollectiondata:any[]=[];
  hourts:number=0;
  responsivearrows:boolean=false;
  summary:boolean=true;
  news:boolean=false;
  chartstab:boolean=false;
  insights:boolean=false;
  
tickererror:boolean=false;
validticker:boolean=false;
  
  
  
  
 
  
  
  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, private modal: NgbModal, private router: Router,private location: Location, private http: HttpClient) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      tap(()=>this.spinner = true),
      switchMap(symbol=>this.suggestauto(symbol)),
      tap(()=>this.spinner = false)
      
    ).subscribe(data=>{
      this.autocompletecomp = data.result;
    });
    
  }

 

  
  ngOnInit(): void {
    this.router.navigate(['/search/home']);
    
  }



  suggestauto(symbol:string){
    const filterbase = {q: symbol, type: 'Common Stock'
    };
    
    if (!symbol||symbol.length===0){
      return[];
    }

      return this.http.get<Autocompletedata>(`http://localhost:8080/autocomplete?q=${symbol}`).pipe(
        map(data => {
          
          const filteredData = data.result.filter(item => !item.symbol.includes('.') && item.type === 'Common Stock');
          return { result: filteredData };
        })
        )
        
      }
    
  
  display(option: any):string {
    return option && option.displaySymbol ? option.displaySymbol : '';
     
  }

  displayupdateddata(symbol:string){
    const uppersymbol = symbol.toUpperCase();
    interval(15000).pipe(
      switchMap(() => this.http.get<any>(`http://localhost:8080/companydetailstwo?q=${uppersymbol}`))
    ).subscribe(call2 => {
    this.data2 = call2;
    this.marketopenclose(call2.t, uppersymbol);
    
      });

  }

  
  displaydetails(symbol:string){
    const uppersymbol = symbol.toUpperCase();
    this.spinner = true;
    forkJoin([
      this.http.get<any>(`http://localhost:8080/companydetailsone?q=${uppersymbol}`),
      this.http.get<any>(`http://localhost:8080/companydetailstwo?q=${uppersymbol}`),
      this.http.get<any>(`http://localhost:8080/companypeers?q=${uppersymbol}`),
      this.http.get<any>(`http://localhost:8080/insighttab?q=${uppersymbol}`),
      this.http.get<any>(`http://localhost:8080/newstab?q=${uppersymbol}`)
    ]).pipe(catchError(error => {
        // Handle error
        console.error('Internal server error:', error);
        this.validticker = true;
        this.spinner = false;
        return throwError('Internal server error');
      })).subscribe(([call1,call2, call3, call4, call5])=>{
      this.data1 = call1;
      this.data2 = call2;
      this.data3 = call3;
      this.data4 = call4;
      this.marketopenclose(call2.t, uppersymbol);
      this.chartdata(uppersymbol, call2.t);
      this.ticker = call1.ticker; 
      this.charttab(uppersymbol); 
      this.displaytotalmspr=this.totalmspr(call4.data); 
      this.displaypositivemspr = this.positivemspr(call4.data);
      this.displaynegativemspr = this.negativemspr(call4.data);
      this.displaytotalchange = this.totalchange(call4.data);
      this.displaypositivechange = this.positivechange(call4.data);
      this.displaynegativechange = this.negativechange(call4.data);
      this.insighttrendschart(uppersymbol);
      this.insightepschart(uppersymbol);
      if (call5.length>20){
        this.data5 = call5.slice(0, 20);
       
      }
      else{
        this.data5 = call5;
      } 
      this.watchlistticker= call1.ticker;
      this.watchlistcompanyname=call1.name;
      this.watchlistc= call2.c;
      this.watchlistd=call2.d;
      this.watchlistdp=call2.dp;
      this.currentprice = call2.c;
      this.alreadyinbuysell(call1.ticker);
   
   this.spinner=false;
    }) 
    
    this.alreadyinwatchlist(uppersymbol);
    
    
    
  }

 

  totalmspr(dataarray:any[]):number{  
    dataarray.forEach(
      item => {
        this.finaltotalmspr += item.mspr;
      }
    );
    return parseFloat(this.finaltotalmspr.toFixed(2));
  }

  positivemspr(dataarray:any[]):number{
    let finalpositivemspr = 0;
    dataarray.forEach(
      item=>{
        if(item.mspr>=0){
          finalpositivemspr+= item.mspr
        }
      }
    );
    return parseFloat(finalpositivemspr.toFixed(2));
  }

  negativemspr(dataarray:any[]):number{
    let finalnegativemspr = 0;
    dataarray.forEach(
      item=>{
        if(item.mspr<0){
          finalnegativemspr+= item.mspr
        }
      }
    );
    return parseFloat(finalnegativemspr.toFixed(2));
  }

  totalchange(dataarray:any[]):number{ 
    let finaltotalchange = 0; 
    dataarray.forEach(
      item => {
        finaltotalchange += item.change;
      }
    );
    return parseFloat(finaltotalchange.toFixed(2));
  }

  positivechange(dataarray:any[]):number{
    let finalpositivechange = 0;
    dataarray.forEach(
      item=>{
        if(item.change>=0){
          finalpositivechange+= item.change;
        }
      }
    );
    return parseFloat(finalpositivechange.toFixed(2));
  }

  negativechange(dataarray:any[]):number{
    let finalnegativechange = 0;
    dataarray.forEach(
      item=>{
        if(item.change<0){
          finalnegativechange+= item.change;
        }
      }
    );
    return parseFloat(finalnegativechange.toFixed(2));
  }


  chartdata(symbol:string, timestamplast:number){
    const uppersymbol = symbol.toUpperCase();
      this.http.get<Stockdata>(`http://localhost:8080/hourchart?q=${uppersymbol}&timestamp=${timestamplast}`)
    .subscribe(data => {
      this.hourchart = data; 
      this.displayhourchart(this.hourchart);
      
    });    
}

displayhourchart(data: Stockdata): void {
  
  console.log(data.results);
  const xdata = data.results.map(item => ([(item.t) * 1000, (item.c)]));
  const ticker = this.ticker;
 
  console.log("xdata", xdata);
  const differencetimestamp = (Date.now()) - (this.hourts* 1000);
  const ismarketopen = differencetimestamp < 60 * 1000;
  const linecolor = ismarketopen ? 'green' : 'red'

  Highcharts.chart('hourchartdisplay', {
    chart: { type: 'line', 
    backgroundColor: 'rgba(245, 245, 245)'},
    title: { text: `${this.ticker} Hourly Price Variation` },
    xAxis: [{
      
      labels: {
        formatter: function () {
          const date = new Date(this.value);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`; 
          return formattedTime;
        }
      }
    }],
    yAxis: [{ title: { text: 'Price' }, opposite: true }],
    tooltip: {
      formatter: function () {
        return `<b>${ticker}:</b>${this.y}`;
      }
    },
    series: [{
      type: 'line',
      data: xdata, 
      name: 'Hourly Price',
      color:linecolor,
      marker: { enabled: false }
    }]
  });
    }


  charttab(symbol:string){
    const uppersymbol = symbol.toUpperCase();
    this.http.get<Stockdata>(`http://localhost:8080/charttab?q=${uppersymbol}`)
    .subscribe(data => {
      this.twoyearchart = data; 
      this.displaytwoyearchart(this.twoyearchart);
      console.log(this.twoyearchart);
    });
  }

  displaytwoyearchart(data: Stockdata):void{
    const ohlc:[number, number, number, number, number][] = [];
    const volume: [number, number][] = [];
    data.results.forEach(item=>{
      const timestamp = new Date(item.t);
      ohlc.push([timestamp.getTime(), item.o, item.h, item.l, item.c]);
      volume.push([timestamp.getTime(), item.v]);
    })

    Highchart.stockChart('twoyearchartdisplay',{  
      rangeSelector:{selected:2},
      title:{text:`${this.ticker} Historical`},
      subtitle:{text:'With SMA and Volume by Price technical indicators'},
      yAxis:[{startOnTick:false, endOnTick:false, labels:{align:'right', x:-3},title:{text:'OHLC'}, height:'60%', lineWidth: 2, resize: {enabled: true}},
            {labels:{align:'right', x:-3,}, title:{text:'Volume'}, top: '65%',height: '35%', offset: 0, lineWidth: 2}],
      tooltip:{split: true},
      plotOptions:{ series:{dataGrouping:{units:[['week', [1]], ['month', [1, 2, 3, 4, 6]]]}}},
      series:[{type: 'candlestick', id: `${this.ticker}`, zIndex: 2, data: ohlc }, 
              {type:'column', id:'volume', data: volume, yAxis:1},
              {type:'vbp', linkedTo:`${this.ticker}`, params: {volumeSeriesID: 'volume'}, dataLabels: {enabled: false},zoneLines: {enabled: false}}, 
              {type:'sma', linkedTo:`${this.ticker}`, zIndex: 1,marker: {enabled: false}},
              ]
    }
    );
  }

  insighttrendschart(symbol:string){
    const uppersymbol = symbol.toUpperCase();
    this.http.get<any>(`http://localhost:8080/insighttrends?q=${uppersymbol}`)
    .subscribe(data => {
      this.insighttrendsdata = data; 
      this.displayinsighttrendschart(this.insighttrendsdata);
      
    });
  }

  displayinsighttrendschart(data:any[]){
    const strongbuy = data.map(item=>item.strongBuy);
    const buy = data.map(item=>item.buy);
    const hold = data.map(item=>item.hold);
    const sell = data.map(item=>item.sell);
    const strongsell = data.map(item=>item.strongSell);
    const period = data.map(item=>item.period)
    console.log(strongbuy);
    
    Highcharts.chart('insightrecommendationtrends', {
      chart:{type:'column'},
      title:{text:'Recommendation Trends'},
      xAxis:{categories:period},
      yAxis:{min:0, title:{text:'#Analysis'}, stackLabels:{enabled:true}},
      legend:{align:'center', floating:true, y:20},
      tooltip: { headerFormat: '<b>{point.x}</b><br/>', pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}' },
      plotOptions:{column:{stacking:'normal', dataLabels:{enabled:true}}},
      series:[{type:'column', name:'Strong Buy', data:strongbuy, color:'rgb(56, 253, 56)'},
      {type:'column', name:'Buy',data:buy, color:'rgb(104, 175, 57)'},
      {type:'column', name:'Hold', data:hold, color:'rgb(103, 65, 4)'},
      {type:'column', name:'Sell', data:sell, color:'rgb(229, 49, 17)'},
      {type:'column', name:'Strong Sell', data:strongsell, color:'rgb(70, 3, 3)'}]
    });

  }

  insightepschart(symbol:string){
    const uppersymbol = symbol.toUpperCase();
    this.http.get<any>(`http://localhost:8080/insighteps?q=${uppersymbol}`)
    .subscribe(data => {
      this.insightepsdata = data; 
      this.displayinsightepschart(this.insightepsdata);
    });
  }

  displayinsightepschart(data:any[]){
    const actual = data.map(item=>( [ item.actual]));
    const estimated =data.map(item=>( [ item.estimate]));
    console.log(actual);
    console.log(estimated);
    
    const surprise = data.map(item=>item.surprise);
    const day = data.map(item=>item.period);

    Highcharts.chart('insightepschart' ,{
      chart:{type:'spline' },
      title:{text:'Historical EPS Surprises'},
      xAxis:{categories:day, labels: {
        formatter: function() {
          const index = this.pos;
          return '<div>'+day[index]+'</div><br/><div>Surprise: '+surprise[index]+'<hr></div>';}}
              },
      yAxis:{title:{text:'Quarterly EPS'}},
      legend:{enabled:true},
      //plotOptions:{spline:{marker:{enabled:false}}},
      series:[{type:'spline', data: actual},{type:'spline', data: estimated}]
    })
  }

  
  marketopenclose(timestamp:number, symbol:string){
    //this.subscription = interval(15000).subscribe(() =>{
    const differencetimestamp = ((Date.now())) - ((timestamp)*1000);
    const currenttime = new Date((Date.now())) ;
    this.currenttimestamp = this.dateformat(currenttime);
    
    

    if (differencetimestamp<60*1000){
      this.market ='Open';
      this.marketopen = true;
      this.displayupdateddata(symbol);
    }
    else{
      this.market = 'Closed';
      this.marketopen = false;
      const pst = (timestamp)*1000
      const date = new Date(pst);
      this.lasttimestamp = this.dateformat(date);
    
    }
 

  }

  /*referred stackoverflow line 101-108*/
  dateformat(date: Date):string{
  const y = date.getFullYear();
  const m = this.zeroplace(date.getMonth() + 1);
  const d = this.zeroplace(date.getDate());
  const hr = this.zeroplace(date.getHours());
  const min = this.zeroplace(date.getMinutes());
  const sec = this.zeroplace(date.getSeconds());
  return `${y}-${m}-${d} ${hr}:${min}:${sec}`;
  }

  zeroplace(digit: number):string{
    return digit < 10 ? '0' + digit : digit.toString();
  }



  slectedsymbol(task:any){

    this.stocktickersymbol = task.option.value.symbol;
    this.displaydetails(this.stocktickersymbol);
    this.displaycontenttab = true;

    window.history.replaceState(null, '', `/search/${this.stocktickersymbol}`);
    
  }

  searchbuttonclick(){
    
    if (this.searchControl && this.searchControl.value) {
      const symbol = this.searchControl.value.trim();
      //this.router.navigate([`/search/${this.ticker}`], { replaceUrl: true });
      window.history.replaceState(null, '', `/search/${symbol}`)
      this.displaydetails(symbol);
      this.displaycontenttab = true;
      this.insighttrendschart(symbol);
      
      this.tickererror=false;
    }else
    {this.tickererror = true;}
   
  }

  clearbutton(){
    this.router.navigate(['/search/home']);
    this.data1 = {}; 
    this.searchControl.reset(); 
    this.displaycontenttab = false;
    this.spinner = false
  }


  openmodalwindow(newsdataitem: any){
    const dialogref = this.dialog.open(NewscardmodalComponent, {
      width: '400px',
      height: '300px',
      data: newsdataitem,
      disableClose:true,
      position: { top: '25' }
  });
  }

  postdatatowatchlist(data1:any):void{
    
    const data = {name:this.watchlistcompanyname, ticker:this.watchlistticker, c:this.watchlistc, d:this.watchlistd, dp:this.watchlistdp}
    console.log(data);
    this.http.get<any>(`http://localhost:8080/addtowatchlist?name=${this.watchlistcompanyname}&ticker=${this.watchlistticker}&c=${this.watchlistc}&d=${this.watchlistd}&dp=${this.watchlistdp}`).subscribe(response => {
      console.log('Added to watchlist:', response);
    });
    this.addedtowtchlist = true
    this.showaddedbox = true;
   setTimeout(()=>{
      this.addedtowtchlist = false;
      this.showaddedbox = false;
    }, 3000);

    this.inwatchlist=true;

  }



  removewatchlistdata(ticker:any){
    //this.watchlistcomponent.deletewatchlistdata(ticker);
    this.http.get<any>(`http://localhost:8080/deletewatchlist/${ticker}`).subscribe(
    () => { 
      console.log('item deleted')
      this.watchlistcollectiondata = this.watchlistcollectiondata.filter(item => item.ticker !== ticker);
  });
    this.inwatchlist = false;
    this.deletedfromwatchlist = true
    this.showdeletedbox = true;
   setTimeout(()=>{
      this.deletedfromwatchlist = false;
      this.showdeletedbox = false;
    }, 3000);
  }

  navigatepeerdata(symbol:string){
   
    this.peerticker = symbol;
    this.displaydetails(symbol);
    window.history.replaceState(null, '', `/search/${symbol}`)
  }

  alreadyinwatchlist(ticker:string):void{
    this.http.get<any>(`http://localhost:8080/checkwatchlist/${ticker}`).subscribe(
      (response) => {
        this.inwatchlist = response.exists;
        console.log(this.inwatchlist);
      }
    );
  
  }

  openbuymodal():void{
    const dialogref = this.dialog.open(BuymodalComponent,{
      width: '300px',
      height: '200px',
      data: {symbol:this.ticker, currentprice:this.currentprice},
      disableClose:true,
      position:{top:'100'}
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'buysuccess') {
        this.inbuysellcollection=true;
    
        console.log('Stocks bought successfully');
        this.stocksbought = true;
        this.stocksboughtbox = true;
        setTimeout(()=>{
          this.stocksbought = false;
          this.stocksboughtbox = false;
        }, 3000);
      }
    });
  }


  

  opensellmodal():void{
    const dialogref = this.dialog.open(SellmodalComponent,{
      width: '300px',
      height: '200px',
      data: {symbol:this.ticker, currentprice:this.currentprice},
      disableClose:true,
      position:{top:'100'}
    });
    dialogref.afterClosed().subscribe(result => {
      if (result === 'sellsuccess') {
        this.alreadyinbuysell(this.ticker)
        console.log('Stocks sold successfully');
        this.stockssold = true;
        this.stockssoldbox = true;
        setTimeout(()=>{
          this.stockssold = false;
          this.stockssoldbox = false;
        }, 3000);
      }
    });

  }

  alreadyinbuysell(ticker:string):void{
    this.http.get<any>(`http://localhost:8080/checkinbuysell/${ticker}`).subscribe(
      (response) => {
        this.inbuysellcollection = response.exists;
        console.log(this.inbuysellcollection);
      }
    );
  
  }
  
  opentab( tabid: string): void {
    this.activetab = tabid;
    if (tabid === 'displaysummary') {
      this.summary = true; 
      this.news = false; 
      this.chartstab =false;
      this.insights=false
    } else if (tabid === 'displaynews') {
      this.summary = false; 
      this.news = true; 
      this.chartstab =false;
      this.insights=false
    } else if (tabid === 'displaycharts') {
      this.summary =false; 
      this.news = false; 
      this.chartstab =true;
      this.insights=false
    }else if (tabid === 'displayinsights') {
      this.summary = false; 
      this.news = false; 
      this.chartstab =false;
      this.insights=true;
    }
  }





}    
interface Autocompletedata{
  count: number;
  result: {description:string; displaySymbol: string; symbol:string; type:string; ticker:string; exchange: string; name:string}[];
  
}

interface Stockdata{
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: {v: number; vw: number; o: number; c: number; h: number; l: number; t: number; n: number;}[];
  status: string;
  request_id: string;
  count: number;
  next_url: string;}



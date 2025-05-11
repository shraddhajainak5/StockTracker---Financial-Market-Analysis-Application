import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AppRouting } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { HighchartsChartModule } from 'highcharts-angular';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatAutocompleteModule, MatOptionModule, CommonModule, FormsModule, AppRouting, HomeComponent,  HighchartsChartModule],
  providers:[WatchlistComponent,  HomeComponent],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private watchlistcomponent: WatchlistComponent){}
  selectedtab: string = 'search'; 

  selecttab(tab: string): void {
    this.selectedtab = tab;

  }
  title = 'webtechassgn3';
  displaydatainwatchlist(){
    this.watchlistcomponent.displaywatchlistdata();
    
  }
}


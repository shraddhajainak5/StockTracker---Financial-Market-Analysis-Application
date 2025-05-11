import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HighchartsChartComponent } from 'highcharts-angular';



export const routes: Routes = [
    {path:'', redirectTo:'/search/home', pathMatch:'full'},
    {path:'search/home', component:HomeComponent},
    {path:'search/:ticker', component:HomeComponent},
    {path:'watchlist', component:WatchlistComponent},
    {path:'portfolio', component:PortfolioComponent}
];

@NgModule({
    
    imports: [RouterModule.forChild(routes), HomeComponent, PortfolioComponent, WatchlistComponent, HttpClientModule, HighchartsChartModule],
    exports:[RouterModule],
    
    
    
    
})


export class AppRouting{}


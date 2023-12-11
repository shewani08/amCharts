import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DemonavigationComponent } from './demonavigation/demonavigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MapsModule } from '@syncfusion/ej2-angular-maps';
import * as PlotlyJS from 'plotly.js-dist-min';

import { CommonModule } from '@angular/common';
import { AfricamapComponent } from './africamap/africamap.component';
import { GraphComponent } from './graph/graph.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { SvgListComponent } from './linerep/linerep.component';
import { NodeLinkComponent } from './node-link/node-link.component';
import { CountrymapComponent } from './countrymap/countrymap.component';
import { LoginComponent } from './login/login.component';

import { AnimateMapComponent } from './animate-map/animate-map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { BubbleComponent } from './bubble/bubble.component';
import { SankeyGraphComponent } from './sankey-graph/sankey-graph.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './shared/dialog/dialog.component';
import {MatTableModule} from '@angular/material/table';



@NgModule({
  declarations: [
    AppComponent,
    DemonavigationComponent,
    DashboardComponent,
    AfricamapComponent,
    GraphComponent,
    HeatmapComponent,
    SvgListComponent,
    NodeLinkComponent,
    CountrymapComponent,
    LoginComponent,
    AnimateMapComponent,
    MapComponent,
    BubbleComponent,
    SankeyGraphComponent,
    DialogComponent
   
   
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MapsModule,
    CommonModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

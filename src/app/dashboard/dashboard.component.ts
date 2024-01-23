import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Output() hideDemo = new EventEmitter<boolean>();
  private breakpointObserver = inject(BreakpointObserver);
  // Replace this URL with the actual URL where your Flask server is running
  dashAppUrl: string = 'http://127.0.0.1:1118/';
  // Safe URL to prevent security errors
  safeDashAppUrl!: SafeResourceUrl;
  showDashboard = true;
  chartData: Array<any> =[];
  showMap=false;
   // Graph data
   graph = {
    data: [
      { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: { color: 'red' } },
      { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: { width: 320, height: 240, title: 'A Fancy Plot' }
  };
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      // Set the value of isHandset
      this.isHandset = matches;
  
      if (matches) {
        return [
          { title: 'Migration from Africa', cols: 2.5, rows: 2.5, showGraph: true, graph: this.graphCard1 },
          { title: 'Migration Through Northern African Routes', cols: 2.5, rows: 2.5, showGraph: true, graph: this.graphCard2 },
          { title: 'Causal Analysis', cols: 2.5, rows: 2.5, showGraph: false, graph: this.graphCard4 },
          { title: 'Data Catalogue', cols: 2.5, rows: 2.5, showGraph: false, graph: this.graphCard3 }
         
        ];
      }
  
      return [
          { title: 'Migration from Africa', cols: 2.5, rows: 2.5, showGraph: true, graph: this.graphCard1 },
          { title: 'Migration Through Northern African Routes', cols: 2.5, rows: 2.5, showGraph: true, graph: this.graphCard2 },
          { title: 'Causal Analysis', cols: 2.5, rows: 2.5, showGraph: true, graph: this.graphCard4 },
          { title: 'Data Catalogue', cols: 2.5, rows: 2.5 ,showGraph: true, graph: this.graphCard3 }
         
      ];
    })
  );
isHandset: any;
  graphCard1: any | undefined;
  graphCard2: any | undefined;
  graphCard3: any | undefined;
  graphCard4: any | undefined;
  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit() {

    this.safeDashAppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashAppUrl);

    
  }

  // generateData() {
  //   this.chartData = [];
  //   for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
  //     this.chartData.push([
  //       `Index ${i}`,
  //       Math.floor(Math.random() * 100)
  //     ]);
  //   }
  //   console.log('this.charData is',this.chartData);
  // }
  // getSafeUrl(): SafeResourceUrl {
  //   return this.safeDashAppUrl;
  // }
  // showCards(e:boolean){
  //   this.showDashboard= e;
  //  // this.hideDemo.emit(false);

  // }
  // returnPage(e:boolean){
  //   this.showDashboard= e;
  // }

}


import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-demonavigation',
  templateUrl: './demonavigation.component.html',
  styleUrls: ['./demonavigation.component.css']
})
export class DemonavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  showDashboard: boolean = true;
    ngOnInit(){
     // this.showDashboard = !window.opener;
    }
    // hideDemo(e:boolean){
    //   this.showDashboard= false;

    // }
}

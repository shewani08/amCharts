import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-demonavigation',
  templateUrl: './demonavigation.component.html',
  styleUrls: ['./demonavigation.component.css']
})
export class DemonavigationComponent {
  shouldShowDashboard: boolean=true;
  showUserGuide: boolean =false;
hideDemo($event: boolean) {
throw new Error('Method not implemented.');
}
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  showDashboard: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Subscribe to route changes and update shouldShowDashboard accordingly
   
  }

  // Function to navigate to the "User Guide" page
  openUserGuideInNewTab() {
    this.showUserGuide = true;
   // window.open('/user-guide', '_blank');
  }
 
}

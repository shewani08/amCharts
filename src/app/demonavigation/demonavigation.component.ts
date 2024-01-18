import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demonavigation',
  templateUrl: './demonavigation.component.html',
  styleUrls: ['./demonavigation.component.css']
})
export class DemonavigationComponent {
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

  constructor(private router: Router) {}

  // Function to navigate to the "User Guide" page
    onUserGuideClick() {
    window.open('/user-guide', '_blank');
  }
}

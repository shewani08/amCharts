import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeLinkComponent } from './node-link/node-link.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DemonavigationComponent } from './demonavigation/demonavigation.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { AppComponent } from './app.component';
const routes: Routes = [
  //{ path: 'dashboard', component: DashboardComponent },
  { path: '', component: DemonavigationComponent }, // Redirect to home if no path specified
  // { path: '**',  component: AppComponent }
  { path: 'user-guide', component: UserGuideComponent },
  // Your existing routes
  //{ path: 'demo', component: DemonavigationComponent},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 
 }

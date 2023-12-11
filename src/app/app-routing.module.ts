import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeLinkComponent } from './node-link/node-link.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DemonavigationComponent } from './demonavigation/demonavigation.component';

const routes: Routes = [
  // Your existing routes
  // { path: 'demo', component: DemonavigationComponent},
  // { path: '', component: LoginComponent, pathMatch: 'full' }, // Redirect to home if no path specified
  // { path: '**',  component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 
 }

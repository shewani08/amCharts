import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeLinkComponent } from './node-link/node-link.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  // Your existing routes
  { path: 'link', component: NodeLinkComponent },
  { path: '', component: DashboardComponent, pathMatch: 'full' }, // Redirect to home if no path specified
  { path: '**',  component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 
 }

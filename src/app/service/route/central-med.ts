import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private http: HttpClient) {}

  getMedRouteData(): Observable<any> {
    return this.http.get('assets/cleaned_central_med_route.csv', { responseType: 'text' });
  }
  
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MigrantYear2050Service {
  constructor(private http: HttpClient) { }
 
  getSspNoSenario(){
    return this.http.get('assets/CURRENT_STATES/no_scenario/country_results_no_scenario_normal_states.csv', { responseType: 'text' });
  }
  
  
}
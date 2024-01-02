import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeatWaterService {
  constructor(private http: HttpClient) {}

  getHeatData(): Observable<any> {
    return this.http.get('assets/cleaned_temperature_data_indicator_tr20_score.csv', { responseType: 'text' });
  }
   getWaterData(){
    return this.http.get('assets/cleaned_water_stress_index_SSP1_score.csv', { responseType: 'text' });
   }

}
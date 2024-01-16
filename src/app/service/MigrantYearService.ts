import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MigrantYearService {
  constructor(private http: HttpClient) { }
 
  getWaterStress(){
    return this.http.get('assets/Year-2030/water_water_stress_index_ssp1_1p5.csv', { responseType: 'text' });
  }
  getHeatMigrantData(){
    return this.http.get('assets/Year-2030/energy_heat_stress_event_exposure_ssp1_1p5.csv', { responseType: 'text' });
  }
  getCropYieldMigrantData(){
    return this.http.get('assets/Year-2030/land_crop_yield_change_ssp1_1p5.csv', { responseType: 'text' });
  }
  getDroughtMigrantData(){
    return this.http.get('assets/Year-2030/water_drought_intensity_change_ssp1_1p5.csv', { responseType: 'text' });
  }
}
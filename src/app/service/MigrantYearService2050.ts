import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MigrantYear2050Service {
  constructor(private http: HttpClient) { }
 
  getWaterStress(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Water_stress_index_SSP1_2050.csv', { responseType: 'text' });
  }
  getWaterStressSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Water_stress_index_SSP2_2050.csv', { responseType: 'text' });
  }
  getWaterStressSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Water_stress_index_SSP3_2050.csv', { responseType: 'text' });
  }
  getHeatMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Heat_stress_event_exposure_SSP1_2050.csv', { responseType: 'text' });
  }
  getHeatMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Heat_stress_event_exposure_SSP2_2050.csv', { responseType: 'text' });
  }
  getHeatMigrantDataSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Heat_stress_event_exposure_SSP3_2050.csv', { responseType: 'text' });
  }
  getCropYieldMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Crop_yield_change_SSP1_2050.csv', { responseType: 'text' });
  }
  getCropYieldMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Crop_yield_change_SSP2_2050.csv', { responseType: 'text' });
  }
  getCropYieldMigrantDataSSp3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Crop_yield_change_SSP3_2050.csv', { responseType: 'text' });
  }
  getDroughtMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Drought_intensity_change_SSP1_2050.csv', { responseType: 'text' });
  }
  getDroughtMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Drought_intensity_change_SSP2_2050.csv', { responseType: 'text' });
  }
  getDroughtMigrantDataSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2050/Drought_intensity_change_SSP3_2050.csv', { responseType: 'text' });
  }
}
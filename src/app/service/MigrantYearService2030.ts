import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MigrantYearService {
  constructor(private http: HttpClient) { }
 
  getWaterStress(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Water stress index_SSP1_2030.csv', { responseType: 'text' });
  }
  getWaterStressSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Water stress index_SSP2_2030.csv', { responseType: 'text' });
  }
  getWaterStressSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Water stress index_SSP3_2030.csv', { responseType: 'text' });
  }
  getHeatMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Heat stress event exposure_SSP1_2030.csv', { responseType: 'text' });
  }
  getHeatMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Heat stress event exposure_SSP2_2030.csv', { responseType: 'text' });
  }
  getHeatMigrantDataSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Heat stress event exposure_SSP3_2030.csv', { responseType: 'text' });
  }
  getCropYieldMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Crop yield change_SSP1_2030.csv', { responseType: 'text' });
  }
  getCropYieldMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Crop yield change_SSP2_2030.csv', { responseType: 'text' });
  }
  getCropYieldMigrantDataSSp3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Crop yield change_SSP3_2030.csv', { responseType: 'text' });
  }
  getDroughtMigrantData(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Drought intensity change_SSP1_2030.csv', { responseType: 'text' });
  }
  getDroughtMigrantDataSSP2(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Drought intensity change_SSP2_2030.csv', { responseType: 'text' });
  }
  getDroughtMigrantDataSSP3(){
    return this.http.get('assets/CURRENT_STATES/climate_scenarios/2030/Drought intensity change_SSP3_2030.csv', { responseType: 'text' });
  }
}
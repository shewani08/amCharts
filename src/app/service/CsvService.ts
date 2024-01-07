


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  constructor(private http: HttpClient) { }
  getCsvData(): Observable<any> {
    return this.http.get('assets/ctydata.csv', { responseType: 'text' });
  }
  getRCPData(): Observable<any> {
    return this.http.get('assets/RCP(low).csv', { responseType: 'text' });
  }
  getDroughtData(): Observable<any> {
    return this.http.get('assets/cleaned_drought_intensity_change_SSP1_score.csv', { responseType: 'text' });
  }
  getHeatData(): Observable<any> {
    return this.http.get('assets/cleaned_temperature_data_indicator_tr20_score.csv', { responseType: 'text' });
  }
  getIrregularMigration(): Observable<any> {
    return this.http.get('assets/irregularMigration.csv', { responseType: 'text' });
  }
  getimmigrationData(): Observable<any> {
    return this.http.get('assets/2050.csv', { responseType: 'text' });
  }
  getAfricaimmigrationData(): Observable<any> {
    return this.http.get('assets/2030.csv', { responseType: 'text' });
  }
  getCropYieldData(): Observable<any> {
    return this.http.get('assets/cleaned_crop_yield_change_SSP1_score.csv', { responseType: 'text' });
  }
  getAgricultureData(): Observable<any> {
    return this.http.get('assets/cleaned_agricultural_water_stress_index_SSP1_score.csv', { responseType: 'text' });
  }
  getMigrantData(): Observable<any> {
    return this.http.get('assets/uk_irregular_african_migrants_cleaned_year_ending_september_2023.csv', { responseType: 'text' });
  }
  getTemperatureData(){
    return this.http.get('assets/cleaned_temperature_data_indicator_tr20_score.csv', { responseType: 'text' });
  }
}
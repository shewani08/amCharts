


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  constructor(private http: HttpClient) {}

  getCsvData(): Observable<any> {
    return this.http.get('assets/ctydata.csv', { responseType: 'text' });
  }
  getRCPData(): Observable<any> {
    return this.http.get('assets/RCP(low).csv', { responseType: 'text' });
  }
  getIrregularMigration():Observable<any>{
    return this.http.get('assets/irregularMigration.csv', { responseType: 'text' });
  }
  getimmigrationData(): Observable<any> {
    return this.http.get('assets/2050.csv', { responseType: 'text' });
  }
}



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
}
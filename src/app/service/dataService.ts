import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
    private mapDataSubject = new BehaviorSubject<any>(null);
    mapData$ = this.mapDataSubject.asObservable();
  
    setMapData(data: any) {
      this.mapDataSubject.next(data);
    }
  }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
    private mapDataSubject = new BehaviorSubject<any>(null);
    mapData$ = this.mapDataSubject.asObservable();

    private setRCPSubject = new BehaviorSubject<any>(null);
    setRCP$ = this.setRCPSubject.asObservable();
  
    setMapData(data: any) {
      this.mapDataSubject.next(data);
    }
    setRCPData(data: any) {
      this.setRCPSubject.next(data);
    }
  }
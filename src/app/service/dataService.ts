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


  private setIndicatorSubject = new BehaviorSubject<any>(null);
  setIndicator$ = this.setIndicatorSubject.asObservable();
  
    setMapData(data: any) {
      this.mapDataSubject.next(data);
    }
    setRCPData(data: any) {
      this.setRCPSubject.next(data);
    }
    setIndicatorData(data: any) {
      this.setIndicatorSubject.next(data);
    }
  }
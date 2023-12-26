import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YearService {
  private selectedYearSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedYear$: Observable<string> = this.selectedYearSubject.asObservable();

  saveSelectedYear(year: string): void {
    this.selectedYearSubject.next(year);
  }
}
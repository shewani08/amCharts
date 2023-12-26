import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousEvntService {
  private previousEventSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  previousEvent$: Observable<string> = this.previousEventSubject.asObservable();

  setPreviousEvent(event: any): void {
    this.previousEventSubject.next(event);
  }
}
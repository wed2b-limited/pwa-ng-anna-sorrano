import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isLoading: BehaviorSubject<boolean>;
  isMobile: boolean = false;
  constructor() {
    this.isLoading = new BehaviorSubject(false);
  }
  show(): void {
    this.isLoading.next(true);
  }
  hide(): void {
    this.isLoading.next(false);
  }

  public checkScreenSize(): boolean {
    this.isMobile = window.innerWidth <= 768;
    return this.isMobile;
  }

}

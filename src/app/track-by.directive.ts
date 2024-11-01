import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appTrackBy]',
  standalone: true,
  exportAs: 'appTrackBy'
})
export class TrackByDirective {

  @Input('appTrackBy') trackByField!: string;

  constructor() {}

  trackByFn(index: number, item: any): any {
    return item[this.trackByField];
  }

}

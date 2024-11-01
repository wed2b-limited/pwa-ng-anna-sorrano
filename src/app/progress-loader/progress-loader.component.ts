import { Component } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";
import { SharedService } from "../shared.service";
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  selector: 'app-progress-loader',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './progress-loader.component.html',
  styleUrl: './progress-loader.component.css',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('10ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('100ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class ProgressLoaderComponent {
  constructor(public sharedService: SharedService) { }
}

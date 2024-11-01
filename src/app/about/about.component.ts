import { Component, OnInit } from '@angular/core';
import { SharedService } from "../shared.service";
import { NgIf } from "@angular/common";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  isMobile: boolean = false;
  cdnUrl = environment.baseCdnUrl;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.isMobile = this.sharedService.checkScreenSize()
  }

}

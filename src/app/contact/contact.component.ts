import { Component, OnInit } from '@angular/core';
import { SharedService } from "../shared.service";
import { NgIf } from "@angular/common";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  isMobile: boolean = false;
  cdnUrl = environment.baseCdnUrl;
  device = 'desktop';
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.isMobile = this.sharedService.checkScreenSize()
    this.device = this.isMobile ? 'mobile' : 'desktop';
  }
}

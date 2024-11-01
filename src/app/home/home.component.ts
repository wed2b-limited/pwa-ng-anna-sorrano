import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { GET_ATTRIBUTE_OPTION_SETTING_BY_VALUE } from "../graphql";
import { Apollo } from "apollo-angular";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";
import { InstagramFeedComponent } from "../instagram-feed/instagram-feed.component";
import { SharedService } from "../shared.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    InstagramFeedComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  brandDescription = 'Discover the stunning new Solis collection by Heidi Hudson. Heidi Hudson designs for all the carefree romantics out there, using billowing fabrics, relaxed shapes and the prettiest nature-inspired details.';
  brandCollectionId = environment.brandCollectionId
  cdnUrl = environment.baseCdnUrl;
  isMobile: boolean = false;
  device: string = 'desktop';
  constructor(private readonly apollo: Apollo,
              private route: ActivatedRoute,
              private sharedService: SharedService,
              private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'home-page');
    this.isMobile = this.sharedService.checkScreenSize();
    this.device = this.isMobile ? 'mobile' : 'desktop';
    this.getAttributeOptionSetting(this.brandCollectionId);
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'home-page');
  }
  getAttributeOptionSetting(value: string) {
    this.apollo
      .watchQuery({
        query: GET_ATTRIBUTE_OPTION_SETTING_BY_VALUE,
        variables: { value: value }
      })
      .valueChanges.subscribe((result: any) => {
      // if (!result.errors)
      //   this.brandDescription = result.data.getAttributeOptionSettingByValue.description
    });
  }

}

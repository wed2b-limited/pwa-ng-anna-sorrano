import {Component, OnInit} from '@angular/core';
import {BrowseComponent} from "./browse/browse.component";
import {GET_ATTRIBUTE_OPTION_SETTING_BY_VALUE, GET_COLLECTIONS} from "../graphql";
import {Apollo} from "apollo-angular";
import {Observable, of} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ProgressLoaderComponent} from "../progress-loader/progress-loader.component";
import {environment} from "../../environments/environment";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {SharedService} from "../shared.service";
import {TrackByDirective} from "../track-by.directive";

interface ImageObject {
  position: number;
  src: string;
}
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    BrowseComponent,
    AsyncPipe,
    NgForOf,
    ProgressLoaderComponent,
    NgIf,
    RouterLink,
    TrackByDirective
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit {
  collection: Observable<any> | undefined;
  bannerDirPath: string = '';
  brandDescription = '';
  cdnUrl = environment.baseCdnUrl;
  items = [];
  isMobile: boolean = false;
  device: string = 'desktop';
  constructor(private readonly apollo: Apollo, private route: ActivatedRoute, private sharedService: SharedService) {}
  ngOnInit(): void {
    this.device = this.sharedService.checkScreenSize() ? 'mobile' : 'desktop';
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const brandCollectionId = params['value'];
      if (brandCollectionId) {
        this.bannerDirPath = this.route.snapshot.url[1].path;
        this.apollo
          .watchQuery({
            query: GET_COLLECTIONS,
            variables: { brandId: environment.brandId, brandCollectionId: brandCollectionId }
          })
          .valueChanges.subscribe((result: any) => {
          if (result.data.products.items.length) {
            this.items = result.data.products.items;
            // @ts-ignore
            this.items = this.items.map((product: Product, index: number) => ({
              ...product,
              sorted_media: this.sortedImages(product, index)
            }));
            this.collection = of(this.items);
            this.getAttributeOptionSetting(brandCollectionId);
          }
        });
     }
    })
  }
  trackByIdentify(index: any, item: { id: any; }) { //TODO get from shared service
    return item.id;
  }

  sortedImages(product:any, index: number) {
    const images = product.media_gallery
      .filter((image: { __typename: string; }) => image.__typename === 'ProductImage')
      .sort((a: { position: number; }, b: { position: number; }) => a.position - b.position);

    if((index % 5 + 1) === 2) {
      if(images.length === 1) {
        images.push(images[0]);
        images.push(images[0]);
      }
      if(images.length === 2) {
        images.push(images[0]);
      }
      return images.slice(0, 3);
    } else if((index % 5 + 1) === 5) {
      return images.slice(0, 1);
    } else {
      return images.slice(0, 2);
    }
  }

  getAttributeOptionSetting(value: string) {
    this.apollo
      .watchQuery({
        query: GET_ATTRIBUTE_OPTION_SETTING_BY_VALUE,
        variables: { value: value }
      })
      .valueChanges.subscribe((result: any) => {
        if (!result.errors)
        this.brandDescription = result.data.getAttributeOptionSettingByValue.description
    });
  }
}

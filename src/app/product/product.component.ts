import {Component, OnInit, ViewChild} from '@angular/core';
import { Apollo } from "apollo-angular";
import { ActivatedRoute, RouterLink } from "@angular/router";
import {
  GET_ALL_COLLECTIONS,
  GET_AVAILABLE_ATTRIBUTE_DATA,
  GET_PRODUCT
} from "../graphql";
import { environment } from "../../environments/environment";
import {delay, Observable, of, tap} from "rxjs";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { NgxGlideComponent } from 'ngx-glide';
import { ProgressLoaderComponent } from "../progress-loader/progress-loader.component";
import { SharedService } from "../shared.service";
import { TrackByDirective } from "../track-by.directive";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgxGlideComponent,
    NgIf,
    ProgressLoaderComponent,
    RouterLink,
    TrackByDirective
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product: Observable<any> | undefined;
  collection: Observable<any> | undefined;
  sliderPerView!: number;
  brandCollectionOptions: any = [];
  hasProductVideo: boolean = true;
  cdnUrl = environment.baseCdnUrl;
  isMobile: boolean = false;
  @ViewChild('ngxGlide') ngxGlide!: NgxGlideComponent;
  constructor(private readonly apollo: Apollo, private route: ActivatedRoute, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sliderPerView = 2;
    this.sliderPerView =  this.sharedService.checkScreenSize() ? 1 : 2;
    this.isMobile = this.sharedService.checkScreenSize();
    this.route.paramMap.subscribe(params => {
      this.getAttributesValues();
      const url_key = params.get('url_key');
      this.apollo
        .watchQuery({
          query: GET_PRODUCT,
          variables: { url_key: url_key }
        })
        .valueChanges.subscribe((result: any) => {
        if (result.data.products.items.length) {
          this.product = of(result.data.products.items).pipe(
            delay(100), // Delay just so ngxGlide can be recreated when url change to new product
            tap(() => {
              if(this.ngxGlide) {
                this.ngxGlide.recreate();
              }
            })
          );
          this.hasProductVideo = result.data.products?.items[0].media_gallery.some((media: { __typename: string }) => media.__typename === 'ProductVideo');
          console.log(this.hasProductVideo);
          const brandAttrOptions = result.data.products?.aggregations.find((item: { attribute_code: string; }) => {
            return item.attribute_code === 'brand_collection';
          });
          if (brandAttrOptions) {
            this.brandCollectionOptions = brandAttrOptions.options;
          }
        }
      });
    });
  }

  formatUrl(Str: string): string { // TODO add global method
    return Str.replace(new RegExp(' ', 'g'), '-').toLowerCase();
  }

  getCollection(array: any) {
    this.apollo
      .watchQuery({
        query: GET_ALL_COLLECTIONS,
        variables: { brandId: environment.brandId, brandCollectionId: array }
      })
      .valueChanges.subscribe((result: any) => {
      if (result.data.products.items.length) {
        const collection = result.data.products.items;
        const randomCollection = this.pickRandomObjects(collection, 4);
        this.collection = of(randomCollection);
      }
    });
  }

  // Function to pick random objects from an array
  pickRandomObjects(array: any[], count: number): any[] {
    let pickedObjects: any[] = [];
    let indices: number[] = [];

    // Generate unique random indices
    while (indices.length < count) {
      let randomIndex = Math.floor(Math.random() * array.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }

    // Push objects at random indices to pickedObjects array
    indices.forEach(index => {
      pickedObjects.push(array[index]);
    });

    return pickedObjects;
  }

  getAttributesValues(): any[] {
    let attr: any[] = [];
      this.apollo
        .watchQuery({
          query: GET_AVAILABLE_ATTRIBUTE_DATA,
          variables: { brandId: environment.brandId }
        })
        .valueChanges.subscribe((result: any) => {
        if (result.data.products.aggregations.length) {
          const aggregations = result.data.products.aggregations;
          const brandCollection = aggregations.find((aggregation: { attribute_code: string; }) => aggregation.attribute_code === 'brand_collection');
          const valueArray = brandCollection.options.map((option: { value: string }) => option.value);
          this.getCollection(valueArray);
        }
      });
    return attr;
  }

}

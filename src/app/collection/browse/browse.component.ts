import {Component, Input, OnInit} from '@angular/core';
import { Apollo } from "apollo-angular";
import { Observable, of } from "rxjs";
import { AsyncPipe, LowerCasePipe, NgForOf, NgIf } from "@angular/common";
import { GET_AVAILABLE_ATTRIBUTE_DATA } from "../../graphql";
import { RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { TrackByDirective } from "../../track-by.directive";

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    LowerCasePipe,
    RouterLink,
    TrackByDirective
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  attributeData: Observable<any> | undefined;
  cdnUrl = environment.baseCdnUrl;
  @Input() data!: any;
  constructor(private readonly apollo: Apollo) {}
  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: GET_AVAILABLE_ATTRIBUTE_DATA,
        variables: { brandId: environment.brandId } //TODO get from env file
      })
      .valueChanges.subscribe((result: any) => {
      if (result.data.products.aggregations.length) {
        const aggregations = result.data.products.aggregations;
        const brandCollection = aggregations.find((aggregation: { attribute_code: string; }) => aggregation.attribute_code === 'brand_collection');
        this.attributeData = brandCollection ? of(brandCollection.options) : of([]);
      }
    });
  }

  trackByIdentify(index: any, item: { id: any; }) { //TODO get from shared service
    return item.id;
  }

  formatUrl(Str: string): string {
    return Str.replace(new RegExp(' ', 'g'), '-').toLowerCase();
  }

}

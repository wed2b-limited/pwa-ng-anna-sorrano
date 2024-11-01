import { Component, OnInit } from '@angular/core';
import { GET_SHOPS } from "../graphql";
import { Observable, of, tap } from "rxjs";
import { Apollo } from "apollo-angular";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { ProgressLoaderComponent } from "../progress-loader/progress-loader.component";
import { SharedService } from "../shared.service";
import { TrackByDirective } from "../track-by.directive";

@Component({
  selector: 'app-stockist',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    ProgressLoaderComponent,
    NgIf,
    NgClass,
    TrackByDirective
  ],
  templateUrl: './stockist.component.html',
  styleUrl: './stockist.component.css'
})

export class StockistComponent implements OnInit {

  countries = [
    { name: 'United Kingdom', id: 1 },
    { name: 'Ireland', id: 2 },
    { name: 'Germany', id: 6 },
    { name: 'Belgium', id: 3 },
    { name: 'The Netherlands', id: 5 },
  ];

  shop: Observable<any> | undefined;
  isMobile: boolean = false;
  constructor(private readonly apollo: Apollo, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.isMobile = this.sharedService.checkScreenSize();
    this.apollo
      .watchQuery({
        query: GET_SHOPS,
        variables: { store_id: 0 }, //TODO get from env file or drop down select option
      })
      .valueChanges.subscribe((result: any) => {
        if (result.data.shop.length) {
          let ukAndIrelandShops: string | any[] = [];

          const arr = this.countries.flatMap((country) => {
            let foundShops = result.data.shop.filter(
              (shop: { shop_main_territory: string }) => shop.shop_main_territory === country.id.toString()
            );

            if (country.id === 1 || country.id === 2) {
              ukAndIrelandShops = [...ukAndIrelandShops, ...foundShops];
              return [];
            } else if (foundShops.length > 0) {
              return [
                {
                  name: country.name,
                  shops: foundShops,
                },
              ];
            } else {
              return [];
            }
          });
          ukAndIrelandShops.sort((a, b) => a.name.localeCompare(b.name)); //Sort so Belfast can be at the top
          if (ukAndIrelandShops.length > 0) {
            arr.push({
              name: 'UK & Ireland',
              shops: ukAndIrelandShops,
            });
          }
          const countryOrder = ['UK & Ireland', 'Germany', 'Belgium', 'The Netherlands'];
          arr.sort((a, b) => countryOrder.indexOf(a.name) - countryOrder.indexOf(b.name));
          this.shop = of(arr);
        }
    });
  }

  toggleNode(node: any) {
    // @ts-ignore
    this.shop.pipe(
      // Optional: Use a map operator to transform the data if needed
      // map(data => data.map(item => ({ ...item, expanded: item === node ? !item.expanded : false }))),
      tap(data => {
        data.forEach((item: { expanded: boolean; }) => item.expanded = item === node ? !item.expanded : false);
      })
    ).subscribe();
  }

}

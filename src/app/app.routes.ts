import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ContactComponent } from "./contact/contact.component";
import { AboutComponent } from "./about/about.component";
import { CollectionComponent } from "./collection/collection.component";
import {ProductComponent} from "./product/product.component";
import {StockistComponent} from "./stockist/stockist.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'collections', component: CollectionComponent },
  { path: 'stockists', component: StockistComponent },
  { path: 'collections/:label', component: CollectionComponent },
  { path: ':url_key', component: ProductComponent }
];

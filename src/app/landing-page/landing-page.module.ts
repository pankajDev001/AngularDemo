import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollSpyDirective } from './scroll-spy.directive';
@NgModule({
  declarations: [LandingPageComponent,ScrollSpyDirective],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    CarouselModule,

  ]
})
export class LandingPageModule { }

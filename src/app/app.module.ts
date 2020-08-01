import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxMaskModule } from 'ngx-mask';
import { InterceptService } from './services/intercept.service';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {LoginGuard} from "./shared/guard/login.guard";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LanguageTranslationModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({preventDuplicates: true}),
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    NgxMaskModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [AuthGuard,LoginGuard, InterceptService,{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

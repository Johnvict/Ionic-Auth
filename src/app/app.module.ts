import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor, DEFAULT_TIMEOUT } from './services/request.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
	AppRoutingModule,
	HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
	{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
	{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
	{ provide: DEFAULT_TIMEOUT, useValue: 60000 }	// We set the request timeout for all HTTP request here
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

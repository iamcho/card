import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { UrlComponent } from './pages/url/url.component';
import { PutianxmComponent } from './pages/putianxm/putianxm.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IdsComponent } from './pages/ids/ids.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { UsersDashboardComponent } from './pages/usersDashboard/usersDashboard.component';
import { CardManagementComponent } from './pages/card-management/card-management.component';
import { cardAuthorizationComponent } from './pages/card-authorization/card-authorization.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    UrlComponent,
    PutianxmComponent,
    IdsComponent,
    CalendarComponent,
    UsersDashboardComponent,
    CardManagementComponent,
    cardAuthorizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

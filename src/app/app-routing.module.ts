import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlComponent } from './pages/url/url.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PutianxmComponent } from './pages/putianxm/putianxm.component';
import { IdsComponent } from './pages/ids/ids.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CardManagementComponent } from './pages/card-management/card-management.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'url',
    component: UrlComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'putianxm',
    component: PutianxmComponent,
  },
  {
    path: 'ids',
    component: IdsComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'card-management',
    component: CardManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

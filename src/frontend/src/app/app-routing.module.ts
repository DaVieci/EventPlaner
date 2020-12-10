import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';
import { EventsComponent } from './dashboard/events.component';

import { AuthGuard } from './services/auth-guard.service';

import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

const dashboardModule = () => import('./dashboard/dashboard.module').then(x => x.DashboardModule);
const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', loadChildren: dashboardModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authModule },
  { path: '**', component: ErrorComponent }
  /*{ path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/login', 
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      }
    ]
  },*/
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })] ,
  exports: [RouterModule]
})
export class AppRoutingModule { }

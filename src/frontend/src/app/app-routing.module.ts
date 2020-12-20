import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { ErrorComponent } from './error/error.component';


import { AuthGuard } from './services/auth-guard.service';


const dashboardModule = () => import('./dashboard/dashboard.module').then(x => x.DashboardModule);
const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', loadChildren: dashboardModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authModule },
  { path: '**', component: ErrorComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })] ,
  exports: [RouterModule]
})
export class AppRoutingModule { }

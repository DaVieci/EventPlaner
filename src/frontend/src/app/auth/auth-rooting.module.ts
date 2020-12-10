import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';

import { NbAuthComponent } from '@nebular/auth';


const routes: Routes = [
  {
      path: '', component: NbAuthComponent,
      children: [
          { path: 'login', component: LoginComponent },
          { path: 'signup', component: SignupComponent }
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRootingModule { }

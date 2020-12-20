import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRootingModule } from './auth-rooting.module';

import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';

import { NbAuthModule } from '@nebular/auth';

import {
  NbLayoutModule,
  NbButtonModule,
  NbFormFieldModule,
  NbInputModule,
  NbCardModule,
  NbIconModule,
  NbUserModule,
  NbAlertModule,
  NbCheckboxModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AuthRootingModule,
    NbLayoutModule,
    NbButtonModule,
    NbFormFieldModule,
    NbInputModule,
    NbCardModule,
    NbIconModule,
    NbUserModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbCheckboxModule,
    NbAuthModule
  ],
  providers: []
})
export class AuthModule { }

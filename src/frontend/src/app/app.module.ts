import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './services/auth-guard.service';

import { NbThemeModule } from '@nebular/theme';
import { 
  NbSidebarModule,
  NbMenuModule,
  NbLayoutModule,
  NbButtonModule,
  NbFormFieldModule,
  NbInputModule,
  NbCardModule,
  NbIconModule,
  NbUserModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { HttpClientModule } from '@angular/common/http';
import { NbPasswordAuthStrategy, NbAuthModule, NbAuthJWTToken } from '@nebular/auth';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ErrorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbButtonModule,
    NbFormFieldModule, 
    NbInputModule, 
    NbCardModule, 
    NbIconModule,
    NbUserModule,
    NbEvaIconsModule,
    HttpClientModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'token'  // this parameter tells where to look for the token
          },
          baseEndpoint: '',   // here goes usually our backend, but we already have defined it in the proxy.conf.json
          login: {
            endpoint: '/api/users',
            method: 'get',
            redirect: {
              success: '/events',
              failure: null,  // stay on the same page
            }
          },
          register: {
            endpoint: '/api/users',
            method: 'post',
          },
          logout: {
            endpoint: '/api/logout',
            method: 'post',
          },
          requestPass: {
            endpoint: '/auth/request-pass',
            method: 'post',
          },
          resetPass: {
            endpoint: '/auth/reset-pass',
            method: 'post',
          }
        }),
      ],
      forms: {},
    }) 
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

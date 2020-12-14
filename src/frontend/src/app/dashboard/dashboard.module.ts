import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRootingModule } from './dashboard-rooting.module';

import {EventsComponent } from './events.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbLayoutModule, NbButtonModule, NbFormFieldModule, NbInputModule, NbCardModule, NbIconModule, NbUserModule, NbAlertModule, NbCheckboxModule } from '@nebular/theme';


@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    DashboardRootingModule,
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
    NbCheckboxModule
  ]
})
export class DashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRootingModule } from './dashboard-rooting.module';

import {EventsComponent } from './events.component';


@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    DashboardRootingModule
  ]
})
export class DashboardModule { }

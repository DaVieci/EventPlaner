import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';
import { AddEventComponent } from './add-event/add-event.component';


const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'edit/:id', component: AddEventComponent },
  { path: 'add', component: AddEventComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRootingModule { }

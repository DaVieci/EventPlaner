import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
      path: '', component: EventsComponent
      /*children: [
          { path: 'add', component: AddEventComponent },
          { path: 'edit/:id', component: EditEventComponent }
      ] */
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRootingModule { }

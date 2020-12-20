import { Component, OnInit } from '@angular/core';

import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends NbRegisterComponent implements OnInit {

  /**
   * Calls function to set page transition.
   */
  ngOnInit(): void {
    this.setPageTransition();
  }

  /**
   * Sets the page transition variable in storage to true, if not already.
   */
  setPageTransition(): void {
    if (!(sessionStorage.getItem('pageTransition') === 'true')) { sessionStorage.setItem('pageTransition','true'); }
  }

}

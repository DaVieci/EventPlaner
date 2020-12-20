import { Component, OnInit } from '@angular/core';

import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent implements OnInit {

  /**
   * Calls the function to set page transition.
   */
  ngOnInit(): void {
    this.setPageTransition();
  }

  /**
   * Sets the page transition variable in storage to true, if not already.
   */
  setPageTransition(): void {
    if (!(sessionStorage.getItem("pageTransition")==="true")) sessionStorage.setItem("pageTransition","true");
  }

}

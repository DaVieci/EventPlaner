import { Component, OnInit } from '@angular/core';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = "EventPlanner";
  user = {};
  user_loggedIn: boolean;

  constructor(
    private readonly sidebarService: NbSidebarService, 
    private authService: NbAuthService
    ) {
      this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          }
        });
      this.authService.isAuthenticated()
        .subscribe(x => this.user_loggedIn = x);
      }

  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }

  ngOnInit(): void {
  }

}

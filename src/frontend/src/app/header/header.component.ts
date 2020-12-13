import { Component, OnInit } from '@angular/core';

import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = "EventPlanner";
  user = {email: String, fullName: String};
  user_loggedIn: boolean;

  constructor(
    private readonly sidebarService: NbSidebarService, 
    private authService: NbAuthService,
    private tokenService: NbTokenService
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

  logout_user() {
    this.tokenService.clear();
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  ngOnInit(): void {
  }

}

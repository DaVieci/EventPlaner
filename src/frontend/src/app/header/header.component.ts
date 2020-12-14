import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private tokenService: NbTokenService,
    private router: Router
    ) {
      this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
            console.log(token);
            console.log("String from token: "+token.toString());
          }
        });
      
      this.authService.isAuthenticated()
        .subscribe(x => this.user_loggedIn = x);
      }

  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }

  public logout_user(): void {
    this.router.navigate(['/auth/logout']);
    this.tokenService.clear();
    sessionStorage.clear();
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  ngOnInit(): void {
  }

}

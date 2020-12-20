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

  /**
   * Sets up authentication, sidebar, user token and route services.
   * Receives the token payload and assigns it to a user variable. The payload contains email address and full name of the user.
   * 
   * @param sidebarService sidebar service provided by Nebular
   * @param authService authentication service provided by Angular
   * @param tokenService user token service provided by Nebular
   * @param router route service from Angular
   */
  constructor(
    private readonly sidebarService: NbSidebarService, 
    private authService: NbAuthService,
    private tokenService: NbTokenService,
    private router: Router
    ) {
      this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload();
          }
        });
      
      this.authService.isAuthenticated()
        .subscribe(x => this.user_loggedIn = x);
      }
  
  /**
   * Toggles the animation for the sidebar to open or close it.
   * @returns `false` 
   */
  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }

  /**
   * Navigates the user to the logout page provided by nebular.
   * Clears the token and all storages.
   * Refreshes the page after 0.1 seconds. Due to the missing of the token, it will lead the user back to the login page.
   */
  public logout_user(): void {
    this.router.navigate(['/auth/logout']);
    this.tokenService.clear();
    sessionStorage.clear();
    setTimeout(()=>{
      window.location.reload();
    }, 100);
  }

  ngOnInit(): void { }
}

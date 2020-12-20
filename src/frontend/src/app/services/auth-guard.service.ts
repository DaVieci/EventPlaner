import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {

  /**
   * Sets up authentication and route services.
   * @param authService authentication service provided by Nebular
   * @param router route service from Angular
   */
  constructor(
    private authService: NbAuthService, 
    private router: Router
  ) {}

  /**
   * Gets the information if the user is currently logged in.
   * @returns the state of authentication. If the state is false, it will redirect to the login page.
   */
  canActivate() {
    return this.authService.isAuthenticated()
    .pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/auth/login']);
        }
      }),
    ); 
  }
}
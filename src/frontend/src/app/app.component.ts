import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'EventPlanner';
  user_loggedIn: boolean;
  
  /**
   * Sets up authentication service and get information if user is logged it.
   * @param authService authentication service provided by Nebular.
   */
  constructor(
    private authService: NbAuthService
  ) { 
    this.authService.isAuthenticated()
        .subscribe(x => this.user_loggedIn = x);
    }
}

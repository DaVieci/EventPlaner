import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  private user_token: String;
  private bearer_token: any;

  events: {
    _id: String,
    title: String,
    start: String,
    end: String,
    body: String,
    user: String
  };

  constructor(
    private authService: NbAuthService,
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("CONSTRUCTOR CALL");
    }

  ngOnInit(): void {
    console.log("ONINIT CALL");
    if(!this.refreshPageOnTransition()) {
      this.getEvents();
    }
  }

  refreshPageOnTransition(): boolean {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
      return true;
    } else {
      return false;
    }
  }

  getEvents(): void {
    var requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearer_token
      }
    };

    fetch("/api/events", requestOptions)
      .then(response => response.text())
      .then(result => {
        //html rendern für event info...
        console.log(result);
        this.events = JSON.parse(result);
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error)
      });


  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDatepicker, NbDateService, NbRangepickerComponent } from '@nebular/theme';

@Component({
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  private user_token: String;
  private bearer_token: any;
<<<<<<< HEAD
=======

  min: Date;
  max: Date;
>>>>>>> EventsPage

  events: {
    _id: String,
    title: String,
<<<<<<< HEAD
    start: String,
    end: String,
    body: String,
    user: String
  };

  constructor(
    private authService: NbAuthService,
=======
    start: Date,
    end: Date,
    body: String,
    user: String,
    image: any,
    category: String,
    status: String
  };

  categories: {
    _id: String,
    type: String
  }

  constructor(
    private authService: NbAuthService,
    protected dateService: NbDateService<Date>,
>>>>>>> EventsPage
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("CONSTRUCTOR CALL");
<<<<<<< HEAD
=======
    console.log();
    //this.min = this.dateService;
    //this.max = this.dateService.addMonth(this.dateService.today(), 1);
>>>>>>> EventsPage
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
<<<<<<< HEAD

=======
  }

  filter_events(): void {
    
  }

  edit_event(event_id: String) {

  }

  delete_event(event_id: String) {
>>>>>>> EventsPage

  }
}

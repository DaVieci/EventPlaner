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

  min: Date;
  max: Date;

  events: {
    _id: String,
    title: String,
    start: Date,
    end: Date,
    body: String,
    user: String,
    picture: String,
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
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("CONSTRUCTOR CALL");
    console.log();
    //this.min = this.dateService;
    //this.max = this.dateService.addMonth(this.dateService.today(), 1);
    }

  ngOnInit(): void {
    console.log("ONINIT CALL");
    if(!this.refreshPageOnTransition()) {
      if(!(sessionStorage.getItem("AddEditDeleteCallOnEvent")==="false")) {
        console.log("call getEvents");
        this.getEvents();
        console.log(this.events);
        this.getCategories();
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "false");
      }
    }
  }

  refreshPageOnTransition(): boolean {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      console.log("refresh!");
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
      return true;
    } else {
      console.log("kein refresh!");
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
        console.log(result);
        this.events = JSON.parse(result);
        // Event json wird im Storage gespeichert
        sessionStorage.setItem("EventsJson", JSON.stringify(this.events));
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error)
      });
  }

  getCategories(): void {
    // hier passiert das gleiche wie bei getEvents()
  }

  filter_events(): void {
    // Was hier passiert: String mit Events wird aus dem Storage geladen und wieder in eine JSON umgewandelt
    var session_events = sessionStorage.getItem("EventsJson");
    console.log(session_events);
    var json_events = JSON.parse(session_events);
    console.log(json_events);
    //
    // Hier wird die JSON nach dem Date-Picker und Kategorien gefiltert!!!
    //
    this.events = json_events;
  }

  edit_event(event_id: String) {

  }

  delete_event(event_id: String) {
    var requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: this.bearer_token
      }
    };

    fetch(`/api/events/${event_id}`, requestOptions)
      .then(result => {
        console.log(result);
      }).catch(err => console.log(err));
  }
}

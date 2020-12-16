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
    start_date: String,
    start_time: String,
    end_date: String,
    end_time: String,
    body: String,
    image: String,
    category: String,
    user: String,
    status: String
  };

  categories: {
    _id: String,
    type: String
  }

  selectedItem: any[];

  constructor(
    private authService: NbAuthService,
    protected dateService: NbDateService<Date>
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("CONSTRUCTOR CALL");
    //this.min = this.dateService;
    //this.max = this.dateService.addMonth(this.dateService.today(), 1);
    //select.selectedChange<>;
    }

  ngOnInit(): void {
    console.log("ONINIT CALL");
    if(!this.refreshPageOnTransition()) {
      if(!(sessionStorage.getItem("AddEditDeleteCallOnEvent")==="false")) {
        this.getEvents();
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "false");
        // evtl. neuer if-Zweig für Kategorien, falls Add/Delete Category implementiert werden soll!
        this.getCategories();
      }
    }
    this.loadCategoriesAfterOneSecond();
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

  loadCategoriesAfterOneSecond(): void {
    console.log("load cats");
    setTimeout(()=>{
      var session_cats = sessionStorage.getItem("CategoriesJson");
      var json_cats = JSON.parse(session_cats);
      this.categories = json_cats;
    }, 1000);
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
        var json_event = JSON.parse(result);
        sessionStorage.setItem("EventsJson", JSON.stringify(json_event));
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });
  }

  getCategories(): void {
    var requestOptions = {
      method: 'GET'
    };
    fetch("/api/categories", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      var json_cat = JSON.parse(result);
      sessionStorage.setItem("CategoriesJson", JSON.stringify(json_cat));
    })
    .catch(error => {
      //ggf http status 403 & 401 verarbeiten
      console.log('error', error);
    });
  }

  filter_events(): void {
    // Was hier passiert: String mit Events wird aus dem Storage geladen und wieder in eine JSON umgewandelt
    var session_events = sessionStorage.getItem("EventsJson");
    var json_events = JSON.parse(session_events);
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
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "true");
        this.ngOnInit();
      })
      .catch(err => console.log(err));
  }
}

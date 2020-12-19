import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  imageID: string;

  selectedItem: any[];

  OneDayInMillisec = 86400000;

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
    }

  ngOnInit(): void {
    console.log("ONINIT CALL");
    if(!this.refreshPageOnTransition()) {
      if(!(sessionStorage.getItem("AddEditDeleteCallOnEvent")==="false")) {
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "false");
        this.getEvents();
        // evtl. neuer if-Zweig für Kategorien, falls Add/Delete Category implementiert werden soll!
        this.getCategories();
      }
      setTimeout(()=>{
        this.loadEventsAndCategories();
      }, 1000);
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

  loadEventsAndCategories(): void {
    var session_cats = sessionStorage.getItem("CategoriesJson");
    var json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
    (<HTMLButtonElement>document.getElementById("filter_button")).click();
  }

  loadCategoriesAfterOneSecond(): void {
    console.log("load cats");
    setTimeout(()=>{
      
    }, 1000);
  }
  loadEventsAfterOneSecond(): void {
    console.log("load events");
    setTimeout(()=>{
      
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
        var json_event = JSON.parse(result);
        sessionStorage.setItem("EventsJson", JSON.stringify(json_event));
      })
      .then(()=>{
        var jsonString = sessionStorage.getItem("EventsJson");
        var json = JSON.parse(jsonString);
        //this.getImage(json[0].image);
        this.imageID = json[0].image;
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });
  }

  // getImage(): void {
  //   var requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       Authorization: this.bearer_token
  //     }
  //   };
  //   fetch("/api/images/5fdce7bed248582623866e8f", requestOptions)
  //     .then(response => {
  //       console.log('PENIS'+response);
  //     })
  //     .catch(error => {
  //       //ggf http status 403 & 401 verarbeiten
  //       console.log('error', error);
  //     });
  // }

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

  filter_events(f: NgForm): void {
    delete this.events;
    var session_events = sessionStorage.getItem("EventsJson");

    var s_date_iso;
    var e_date_iso;
    var s_day_msec;
    var e_day_msec;
    var filtered_events;

    var date_range = {};
    if (!(f.value.date_range===null)) {
      date_range = f.value.date_range;
      if (Object.keys(f.value.date_range).length) {
        s_date_iso = new Date(f.value.date_range.start);
        if (f.value.date_range.end) {
          e_date_iso = new Date(f.value.date_range.end);
        } else {
          e_date_iso = s_date_iso;
        }
        s_day_msec = s_date_iso.getTime();
        e_day_msec = e_date_iso.getTime() + this.OneDayInMillisec - 1;
      }
    }

    var cat_arr = [];
    if (!(f.value.cats==="")) cat_arr = f.value.cats;

    if (!Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events);
    } else if (Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({start_date}) => this.checkDateBetweenStartAndEnd(start_date,s_day_msec,e_day_msec));
    } else if (!Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({category}) => cat_arr.includes(category));
    } else if (Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({start_date, category}) => this.checkDateBetweenStartAndEnd(start_date,s_day_msec,e_day_msec) && cat_arr.includes(category));
    } else {
      console.log("FATAL ERROR! This code part should have never been reached. Have a look at the following:");
      console.log("Date Picker: "+f.value.date_range);
      console.log("Categories Select: "+f.value.cats);
    }
    this.events = filtered_events;
  }

  checkDateBetweenStartAndEnd(date: string, start: number, end: number): boolean {
    var json_date = new Date(date);
    if ((start<=json_date.getTime()) && (json_date.getTime()<=end)) {
      return true;
    } else {
      return false;
    } 
  }

  formatDateToIso(date: string): string {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    var date_iso = [year, month, day].join('-');
    return date_iso;
  }

  edit_event(event_id: String) {

  }

  delete_event(event_id: String, index: number) {
    var userselection = confirm("Are you sure you want to delete this event?");
    if (userselection === true) {
      var requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: this.bearer_token
        }
      };
      fetch(`/api/events/${event_id}`, requestOptions)
        .then(result => {
          console.log(result);
          delete this.events;
          sessionStorage.setItem("AddEditDeleteCallOnEvent", "true");
          this.ngOnInit();
        })
        .catch(err => console.log(err));
    }
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';

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

  image_path = '../frontend/src/assets/event_pics/';

  imageID: string;
  sel_cats: string;

  selectedItem: any[];

  OneDayInMillisec = 86400000;

  imgID: any;
  imgURL: string;

  /**
   * Initialize the route service to navigate to other sites and the authentication service to get the user token which holds their full name and email address.
   * @param authService authentication service provided by Nebular
   * @param router router service
   */
  constructor(
    private authService: NbAuthService,
    private router: Router
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    }
  
  /**
   * Calls `getEvents()` and `getCategories()` to get categories and all events from user and stores them in storages on page transition.
   * The apis will only be called afterwards if one event has got added, editted or deleted. 
   */
  ngOnInit(): void {
    if(!this.refreshPageOnTransition()) {
      if(!(sessionStorage.getItem("AddEditDeleteCallOnEvent")==="false")) {
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "false");
        this.getEvents();
        this.getCategories();
      }
      setTimeout(()=>{
        this.loadEventsAndCategories();
      }, 1000);
    }
  }

  /**
   * Refreshes the page if coming from the login page or entering the site from scratch.
   * @returns `true` when coming from login page, `false` when page is getting refreshed for the next time
   */
  refreshPageOnTransition(): boolean {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Loads categories from storage and sets them in the input field. 
   * Calls the `filter_events(f: NgForm)` function by dynamically clicking on the filter button of the HTML file.
   */
  loadEventsAndCategories(): void {
    var session_cats = sessionStorage.getItem("CategoriesJson");
    var json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
    (<HTMLButtonElement>document.getElementById("filter_button")).click();
  }

  /**
   * Sets the options for a get api with the user token and calls it.
   * If successful, it will return all events form the user. Then they will be stored as a json string and the image url will be set.
   */
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
        this.imgID = json[0].image;
        this.imgURL = this.image_path + this.imgID;
        console.log("ImageURL: "+this.imgURL);
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
  //   fetch(this.imgURL, requestOptions)
  //     .then(res => {
  //       //something with res.body
  //       console.log(res.body);
  //     })
  //     .catch(error => {
  //       //ggf http status 403 & 401 verarbeiten
  //       console.log('error', error);
  //     });
  // }

  /**
   * Sets the options for a get api and calls it.
   * If successful, it will return all categories. Then they will be stored as a json string. 
   */
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

  /**
   * Takes the data inputs of date und category to apply filtering on the json file that contains all events.
   * @param f a json data which contains values of the form inputs
   */
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
    this.events = filtered_events.sort();
  }

  /**
   * Checks if the given `date` is in the range of a `start` date and an `end` date.
   * @param date A date as string
   * @param start start date in milliseconds since 1970
   * @param end end date in milliseconds since 1970
   * @returns `true`or `false` 
   */
  checkDateBetweenStartAndEnd(date: string, start: number, end: number): boolean {
    var json_date = new Date(date);
    if ((start<=json_date.getTime()) && (json_date.getTime()<=end)) {
      return true;
    } else {
      return false;
    } 
  }

  /**
   * Navigates to the /add-event site with the given `event_id` to edit the whole event.
   * @param event_id id of the event
   */
  edit_event(event_id: String): void {
    this.router.navigate(['/events/edit', event_id]);
  }

  /**
   * Sets the options for a delete api with user token and the event id and calls it.
   * If successful, it will delete the event with the given `event_id`.
   * The variable for adding, editting or deleting an event will set to true to call the get apis after page refresh.
   * Then it will call `NgOnInit()` to 
   * @param event_id id of the event
   */
  delete_event(event_id: String): void {
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

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

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
    _id: string,
    title: string,
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string,
    body: string,
    image: string,
    category: string,
    user: string,
    status: string
  };

  categories: {
    _id: string,
    type: string
  };

  selCats: string;

  OneDayInMillisec = 86400000;

  imgMime: string;

  /**
   * Initialize the route service to navigate to other sites and the authentication service to get the user token which holds their full name and email address.
   * @param authService authentication service provided by Nebular
   * @param router router service
   */
  constructor(
    private authService: NbAuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user_token = token.toString();
          this.bearer_token = 'Bearer ' + this.user_token;
        }
      });
  }

  /**
   * Calls `getEvents()` and `getCategories()` to get categories and all events from user and stores them in storages on page transition.
   * The apis will only be called afterwards if one event has got added, editted or deleted. 
   */
  ngOnInit(): void {
    if (!this.refreshPageOnTransition()) {
      if (!(sessionStorage.getItem('AddEditDeleteCallOnEvent') === 'false')) {
        sessionStorage.setItem('AddEditDeleteCallOnEvent', 'false');
        this.getEvents();
        this.getCategories();
      }
      setTimeout(() => {
        this.loadEventsAndCategories();
      }, 1000);
    }
  }

  /**
   * Refreshes the page if coming from the login page or entering the site from scratch.
   * @returns `true` when coming from login page, `false` when page is getting refreshed for the next time
   */
  refreshPageOnTransition(): boolean {
    if (!(sessionStorage.getItem('pageTransition') === 'false')) {
      sessionStorage.setItem('pageTransition', 'false');
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
    const sessionCats = sessionStorage.getItem('CategoriesJson');
    const jsonCats = JSON.parse(sessionCats);
    this.categories = jsonCats;
    (<HTMLButtonElement>document.getElementById('filter_button')).click();
  }

  /**
   * Sets the options for a get api with the user token and calls it.
   * If successful, it will return all events form the user. Then they will be stored as a json string and the image url will be set.
   */
  getEvents(): void {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearer_token
      }
    };
    fetch('/api/events', requestOptions)
      .then(response => response.text())
      .then(result => {
        var jsonEvent = JSON.parse(result);
        sessionStorage.setItem('EventsJson', JSON.stringify(jsonEvent));
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });
  }

  /**
   * Sets the options for a get api and calls it.
   * If successful, it will return all categories. Then they will be stored as a json string. 
   */
  getCategories(): void {
    const requestOptions = {
      method: 'GET'
    };
    fetch('/api/categories', requestOptions)
      .then(response => response.text())
      .then(result => {
        const jsonCat = JSON.parse(result);
        sessionStorage.setItem('CategoriesJson', JSON.stringify(jsonCat));
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });
  }

  /**
   * Converts the given base64 img code from the json file into a real picture and returns the url.
   * If no image is set in the specific event, it will show a sample image from the assets folder.
   * @param imgCode base64 code given from the json
   * @returns url to the newly generated picture
   */
  convertBase64ToImageURL(imgCode: string): any {
    if (imgCode) {
      const image_blob = this.convertDataUrlToBlob(imgCode);
      const objectURL = URL.createObjectURL(image_blob);
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
      return url;
    } else {
      return './../../assets/event_pics/festival1.jpg';
    }
  }

  /**
   * Generates a blob from the given base64 code 
   * @param url base64 image code
   * @returns a blob
   */
  convertDataUrlToBlob(url: string): Blob {
    const arr = url.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    console.log(mime);
    this.imgMime = mime;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Takes the data inputs of date und category to apply filtering on the json file that contains all events.
   * @param f a json data which contains values of the form inputs
   */
  filter_events(f: NgForm): void {
    delete this.events;
    var session_events = sessionStorage.getItem('EventsJson');

    var s_date_iso;
    var e_date_iso;
    var s_day_msec;
    var e_day_msec;
    var filtered_events;

    var date_range = {};
    if (!(f.value.date_range === null)) {
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
    if (!(f.value.cats === '')) cat_arr = f.value.cats;

    if (!Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events);
    } else if (Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({ start_date }) => this.checkDateBetweenStartAndEnd(start_date, s_day_msec, e_day_msec));
    } else if (!Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({ category }) => cat_arr.includes(category));
    } else if (Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({ start_date, category }) => this.checkDateBetweenStartAndEnd(start_date, s_day_msec, e_day_msec) && cat_arr.includes(category));
    } else {
      console.log('FATAL ERROR! This code part should have never been reached. Have a look at the following:');
      console.log('Date Picker: ' + f.value.date_range);
      console.log('Categories Select: ' + f.value.cats);
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
    if ((start <= json_date.getTime()) && (json_date.getTime() <= end)) {
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
    var userselection = confirm('Are you sure you want to delete this event?');
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
          sessionStorage.setItem('AddEditDeleteCallOnEvent', 'true');
          this.ngOnInit();
        })
        .catch(err => console.log(err));
    }
  }
}

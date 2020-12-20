import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';


@Component({
  selector: 'app-add-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  categories: {
    type: string
  };

  user = {
    email: String,
    fullName: String
  };
  private userToken: string;
  private bearerToken: any;

  id_event: string;

  titleValue: string;
  sdateValue: Date;
  stimeValue: Date;
  edateValue: Date;
  edateMin: Date;
  etimeValue: Date;
  etimeMin: Date;
  bodyValue: string;
  selCat: string;
  selStat: string;

  imageFromJson: string;
  imageLink: string;
  imageUrl: string;

  dummyButton: boolean;
  canvVisible: boolean;
  delImgButton: boolean;
  errorMsg: boolean;
  successMsg: boolean;

  /**
   * Sets up the services and user token.
   * @param authService authentication service provided by Nebular
   * @param acRoute route service from Angular
   */
  constructor(
    private authService: NbAuthService,
    private acRoute: ActivatedRoute
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          this.userToken = token.toString();
          this.bearerToken = 'Bearer ' + this.userToken;
        }
      });
  }

  /**
   * When on page load, the canvas, buttons and alert boxes will be disabled.
   * Loads categories from the storage.
   * Gets the event id from the url. If an ID exists, 
   * it will load all information from the given event id and puts them into the right fields.
   * If an event has got created, it will clear all inputs and show a success alert.
   * If an event has got editted, it will only an success alert.
   */
  ngOnInit(): void {
    this.canvVisible = false;
    this.delImgButton = false;
    this.errorMsg = false;
    this.successMsg = false;
    this.dummyButton = true;
    this.loadCategoriesFromStorage();
    this.id_event = this.acRoute.snapshot.paramMap.get('id');
    if (this.id_event) {
      if (sessionStorage.getItem('EventEditted') === 'true') {
        sessionStorage.removeItem('EventEditted');
        this.successMsg = true;
      } else {
        console.log(this.id_event);
        this.getEventById();
        setTimeout(() => {
          this.loadEventInInputs();
        }, 1000);
      }
    } else if (sessionStorage.getItem('EventCreated') === 'true') {
      sessionStorage.removeItem('EventCreated');
      this.clearAllInputs();
      this.successMsg = true;
    }
    setTimeout(() => {
      (<HTMLButtonElement>document.getElementById("dummy_button")).click();
    }, 1000);
  }

  /**
   * Loads categories from storage and sets them into the select field.
   */
  loadCategoriesFromStorage(): void {
    console.log('load cats');
    const session_cats = sessionStorage.getItem("CategoriesJson");
    const json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
  }

  /**
   * Loads the base64 image code from the json and creates an image.
   * @param b64 base64 code of the img
   * @returns url to the image
   */
  createImageUrl(b64: string): string {
    const imageBlob = this.convertDataUrlToBlob(b64);
    const objectURL = URL.createObjectURL(imageBlob);
    return objectURL;
  }

  /**
   * Converts base64 to a blob.
   * @param b64_code base64 code
   * @returns blob
   */
  convertDataUrlToBlob(bCode: string): Blob {
    const arr = bCode.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Sets the options, the event id and the bearer token for the get api and calls it.
   * If successful, it will return the whole event from the given id. The event will be stored as a json string.
   */
  getEventById(): void {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearerToken
      }
    };
    fetch(`/api/events/${this.id_event}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        const json_event = JSON.parse(result);
        sessionStorage.setItem('EditEventJson', JSON.stringify(json_event));
      })
      .catch(err => console.log(err));
  }

  /**
   * Loads the event from the storage and sets the information into the right input fields.
   * If an image is given, it will create an url out of the base64 code and display the image on the canvas. 
   */
  loadEventInInputs(): void {
    const sessionEvent = sessionStorage.getItem('EditEventJson');
    const jsonEvent = JSON.parse(sessionEvent);
    console.log(jsonEvent);
    this.titleValue = jsonEvent.title;
    this.sdateValue = jsonEvent.start_date;
    this.stimeValue = jsonEvent.start_time;
    this.edateValue = jsonEvent.end_date;
    this.etimeValue = jsonEvent.end_time;
    this.bodyValue = jsonEvent.body;
    this.imageFromJson = jsonEvent.image;
    if (this.imageFromJson) {
      this.imageLink = this.createImageUrl(this.imageFromJson);
      this.showImageOnCanvas();
    }
    this.selCat = jsonEvent.category;
    this.selStat = jsonEvent.status;
  }

  /**
   * Clears all input fields.
   */
  clearAllInputs(): void {
    this.titleValue = "";
    this.sdateValue = null;
    this.stimeValue = null;
    this.edateValue = null;
    this.etimeValue = null;
    this.bodyValue = "";
    (<HTMLInputElement>document.getElementById('inpimg')).value = null;
  }

  /**
   * Sets all input form values to the belonged input fields.
   * @remarks both don't have the same values apparently
   * @param f json which holds all field values
   */
  setFormValueToInputFields(f: NgForm): void {
    if (!(f.value.title === '')) { this.titleValue = f.value.title; }
    if (!(f.value.body === '')) { this.bodyValue = f.value.body; }
    if (!(f.value.cat === '')) { this.selCat = f.value.cat; }
    if (!(f.value.stat === '')) { this.selStat = f.value.stat; }
  }

  /**
   * Sets all date form values to the belonged input fields.
   * @remarks both don't have the same values apparently
   * @param f json which holds all field values
   */
  setFormValueToDateFields(f: NgForm): void {
    if (!(f.value.start_date === '')) { this.sdateValue = f.value.start_date; }
    if (!(f.value.start_time === '')) { this.stimeValue = f.value.start_time; }
    if (!(f.value.end_date === '')) { this.edateValue = f.value.end_date; }
    if (!(f.value.end_time === '')) { this.etimeValue = f.value.end_time; }
  }

  /**
   * Sets a json with all the values of the fields. Sets options for either an post or put call and calls it.
   * If successful, it will set some variables in the storage to mark the successful call for the next page load.
   * @param f json which holds all field values
   */
  uploadEvent(f: NgForm): void {
    if (this.imageFromJson) {
      if (!(this.imageUrl)) this.imageUrl = this.imageFromJson;
    }
    this.setFormValueToInputFields(f);
    this.setFormValueToDateFields(f);
    var sd = '', st = '', ed = '', et = '';
    if (this.sdateValue) sd = this.sdateValue.toString();
    if (this.stimeValue) st = this.stimeValue.toString();
    if (this.edateValue) ed = this.edateValue.toString();
    if (this.etimeValue) et = this.etimeValue.toString();
    if (!(this.titleValue === '') && !(sd === '') && !(st === '') && !(ed === '') && !(et === '')) {
      this.errorMsg = false;
      const json_events = {
        title: this.titleValue,
        start_date: this.sdateValue,
        start_time: this.stimeValue,
        end_date: this.edateValue,
        end_time: this.etimeValue,
        body: this.bodyValue,
        image: this.imageUrl,
        category: this.selCat,
        user: this.user.email,
        status: this.selStat
      };
      const str_events = JSON.stringify(json_events);
      let push_method;
      let push_api;
      if (this.id_event) {
        push_method = 'PUT';
        push_api = `/api/events/${this.id_event}`;
      } else {
        push_method = 'POST';
        push_api = "/api/events";
      }
      const requestOptions = {
        method: push_method,
        headers: {
          Authorization: this.bearerToken,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: str_events
      };
      fetch(push_api, requestOptions)
        .then(response => response.text())
        .then(result => {
          if (this.id_event) {
            sessionStorage.setItem('EventEditted', 'true');
          } else {
            sessionStorage.setItem('EventCreated', 'true');
          }
          sessionStorage.setItem('AddEditDeleteCallOnEvent', 'true');
          this.ngOnInit();
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      this.errorMsg = true;
    }
  }

  /**
   * If start-date goes behind the end-date, it will set end-date and end-time to the values of start-date and start-time.
   * Sets the minimum date to the start-date.
   * @param f json which holds all field values
   */
  setDateMinimums(f: NgForm): void {
    this.setFormValueToDateFields(f);
    this.edateMin = this.sdateValue;
    let eD = new Date(this.edateValue);
    let sD = new Date(this.sdateValue);
    if (eD.getTime() <= sD.getTime()) {
      this.edateValue = this.sdateValue;
      this.etimeValue = this.stimeValue;
    }
  }

  /**
   * If start-date equals end-date and the start-time goes behind the end-time, it will set end-time to the start-time. Same vice verca.
   * @param f json which holds all field values
   * @param inputT string that marks the input which has got clicked
   */
  setTimeMinimums(f: NgForm, inputT: String): void {
    this.setFormValueToDateFields(f);
    let e_d = new Date(this.edateValue);
    let s_d = new Date(this.sdateValue);
    if (e_d.getTime() === s_d.getTime()) {
      if (f.value.end_time < f.value.start_time) {
        if (inputT === 's_t') {
          this.etimeValue = f.value.start_time;
        } else if (inputT === 'e_t') {
          this.stimeValue = f.value.end_time;
        }
      }
    }
  }

  /**
   * Gets the uploaded image or the image from the given json and displays it on a canvas.
   * If it's a newly uploaded picture, it will store it's base64 code in a variable of the storage.
   */
  showImageOnCanvas(): void {
    this.canvVisible = true;
    this.delImgButton = true;
    var image = <HTMLInputElement>document.getElementById('inpimg');
    var background = new Image();
    var imglink = this.imageLink;
    if (imglink) {
      background.src = imglink;
    } else {
      background.src = URL.createObjectURL(image.files[0]);
    }
    background.onload = function () {
      var canvas = <HTMLCanvasElement>document.getElementById('canvimg');
      const context = canvas.getContext('2d');
      canvas.width = background.width;
      canvas.height = background.height;
      context.drawImage(background, 0, 0);
      if (!(imglink)) {
        const imgurl = canvas.toDataURL('image/jpeg');
        sessionStorage.setItem('ImageBase64', imgurl);
      }
    }
    this.imageUrl = sessionStorage.getItem('ImageBase64');
    sessionStorage.removeItem('ImageBase64');
  }

  /**
   * Deletes an uploaded image or an image from the given json.
   * Clears canvas and variables.
   */
  deleteImageUpload(): void {
    (<HTMLInputElement>document.getElementById('inpimg')).value = null;
    const canvas = <HTMLCanvasElement>document.getElementById('canvimg');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.imageUrl = '';
    this.imageLink = '';
    this.imageFromJson = '';
    this.delImgButton = false;
    this.canvVisible = false;
    setTimeout(() => {
      (<HTMLButtonElement>document.getElementById('dummy_button')).click();
    }, 1000);
  }

}

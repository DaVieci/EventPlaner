import { Time } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbFormFieldComponent } from '@nebular/theme';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';


@Component({
  selector: 'app-add-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  event: {
    title: String,
    start: Date,
    end: Date,
    body: String,
    image: String,
    category: String,
    user: String,
    status: String
  };

  categories: {
    type: String
  };

  user = {
    email: String,
    fullName: String
  };

  selectedCategory: String;
  selectedStatus: String;

  edate_min: Date;
  edate_value: Date;
  etime_min: Date;
  etime_value: Date;

  stime_value: Date;

  imageLink: string;
  imageURL: string;

  canv_visible: boolean;
  delimg_button: boolean;

  constructor(
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user = token.getPayload();
          }
        });
  }

  ngOnInit(): void {
    this.canv_visible = false;
    this.delimg_button = false;
    this.loadCategoriesFromStorage();
  }

  loadCategoriesFromStorage(): void {
    console.log("load cats");
    var session_cats = sessionStorage.getItem("CategoriesJson");
    var json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
  }

  uploadEvent(f: NgForm): void {
    // sessionStorage von Events auf "true" setzen, falls erfolgreich
    console.log(f.value);
    console.log(this.selectedCategory);
    console.log(this.selectedStatus);
  }

  setDateMinimums(f: NgForm): void {
    this.edate_min = f.value.start_date;
    let e_d = new Date(f.value.end_date);
    let s_d = new Date(f.value.start_date);
    console.log(e_d+" "+s_d);
    if (e_d.getTime()<=s_d.getTime()) {
      console.log("Start Datum: "+f.value.start_date);
      console.log("Mindest Datum: "+this.edate_min);
      this.edate_value = this.edate_min;  // Bug: Wenn f.value.end_date danach aufgerufen wird, erscheint noch das vorherige Datum
      this.etime_value = f.value.start_time;  // Bei time ist das nicht der Fall
      console.log("Wert für End Datum: "+f.value.end_date);
    } 
  }

  setTimeMinimums(f: NgForm, inputT: String): void {
    let e_d = new Date(f.value.end_date);
    let s_d = new Date(f.value.start_date);
    console.log(e_d+" "+s_d);
    if (e_d.getTime()===s_d.getTime()) {
      if (f.value.end_time < f.value.start_time) {
        console.log(inputT);
        if (inputT==='s_t') {
          this.etime_value = f.value.start_time;
        } else if (inputT==='e_t') {
          this.stime_value = f.value.end_time;
        }
      }
    }
  }

  showImageOnCanvas(): void {
    this.canv_visible = true;
    this.delimg_button = true;
    var image = <HTMLInputElement>document.getElementById("inpimg");
    var background = new Image();
    var imglink = this.imageLink;
    if(imglink){
      // falls wir edit event implementieren möchten, wird imglink vom bereits vorhandenen Image gesetzt
      background.src = imglink;
    }else {
      background.src = URL.createObjectURL(image.files[0]);
    }
    background.onload = function () {
      var canvas = <HTMLCanvasElement>document.getElementById("canvimg");
      const context = canvas.getContext("2d");
      canvas.width = background.width;
      canvas.height = background.height;
      context.drawImage(background, 0, 0);
      if(!(imglink)) {
          var imgurl = canvas.toDataURL('image/jpeg');
          sessionStorage.setItem("ImageBase64", imgurl);
      }
    }
    this.imageURL = sessionStorage.getItem("ImageBase64");
    sessionStorage.removeItem("ImageBase64");
  }

  deleteImageUpload(): void {
    (<HTMLInputElement>document.getElementById("inpimg")).value = null;
    var canvas = <HTMLCanvasElement>document.getElementById("canvimg");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.imageURL = "";
    this.imageLink = "";
    this.delimg_button = false;
    this.canv_visible = false;
  }

}

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
    type: String
  };

  user = {
    email: String,
    fullName: String
  };
  private user_token: String;
  private bearer_token: any;

  id_event: string;

  title_value: string;
  sdate_value: Date;
  stime_value: Date;
  edate_value: Date;
  edate_min: Date;
  etime_value: Date;
  etime_min: Date;
  body_value: string;

  sel_cat: string;
  sel_stat: string;

  dummy_button: boolean;

  imageLink: string;
  imageURL: string = "";
  base64Img: string;

  canv_visible: boolean;
  delimg_button: boolean;
  error_msg: boolean;
  success_msg: boolean;


  constructor(
    private authService: NbAuthService,
    private acRoute: ActivatedRoute
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          this.user_token = token.toString();
          this.bearer_token = 'Bearer '+this.user_token;
        }
      });
    
  }

  ngOnInit(): void {
    this.canv_visible = false;
    this.delimg_button = false;
    this.error_msg = false;
    this.success_msg = false;
    this.dummy_button = true;
    // div für success
    this.loadCategoriesFromStorage();
    this.id_event = this.acRoute.snapshot.paramMap.get('id');
    if (this.id_event) {
      if (sessionStorage.getItem("EventEditted")==="true") {
        sessionStorage.removeItem("EventEditted");
        this.success_msg = true;
      } else {
        console.log(this.id_event); 
        this.getEventById(this.id_event);
        setTimeout(()=>{
          this.loadEventInInputs();
        }, 1000);
      }
    } else if (sessionStorage.getItem("EventCreated")==="true") {
      sessionStorage.removeItem("EventCreated");
      
      console.log("Clear inputs");
      this.clearAllInputs();
      this.success_msg = true;
     
    }
    setTimeout(()=>{
      console.log("DUMMY BUTTON");
      (<HTMLButtonElement>document.getElementById("dummy_button")).click();
    }, 1000);
  }

  loadCategoriesFromStorage(): void {
    console.log("load cats");
    var session_cats = sessionStorage.getItem("CategoriesJson");
    var json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
  }

  getEventById(id: string): void {
    var requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearer_token
      }
    };
    fetch(`/api/events/${id}`, requestOptions)
      .then(response => response.text()) 
      .then(result => {
        console.log(result);
        var json_event = JSON.parse(result);
        sessionStorage.setItem("EditEventJson", JSON.stringify(json_event));
      })
      .catch(err => console.log(err));
  }

  loadEventInInputs(): void {
    var session_event = sessionStorage.getItem("EditEventJson");
    var json_event = JSON.parse(session_event);
    console.log(json_event);
    this.title_value = json_event.title;
    this.sdate_value = json_event.start_date;
    this.stime_value = json_event.start_time;
    this.edate_value = json_event.end_date;
    this.etime_value = json_event.end_time;
    this.body_value = json_event.body;
    //this.imageLink = json_event.image;
    //this.showImageOnCanvas();
    this.sel_cat = json_event.category;
    this.sel_stat = json_event.status;
  }

  clearAllInputs(): void {
    this.title_value = "";
    this.sdate_value = null;
    this.stime_value = null;
    this.edate_value = null;
    this.etime_value = null;
    this.body_value = "";
    (<HTMLInputElement>document.getElementById("inpimg")).value = null;
  }

  //upload Event und image combined
  uploadEventWithImage(f: NgForm): void {


      //var imgURL = this.uploadImage()
      var imgURL ="IRGENDWAS";
      if (!(imgURL === "")) {
        this.uploadEvent(f, imgURL);
      } else {
        console.log("IF/ELSE: something went wrong");
      }

  }

  uploadImage(): string {

    var img_url = "";

    const imgBody = {
      base64img: sessionStorage.getItem("ImageBase64")
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: this.bearer_token,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(imgBody)
    };
    fetch("/api/images", requestOptions)
      .then(response => response.text())
      .then(response => {
        //response = response.replace('"', '');
        var imgURL = '/api/images/'+response;
        console.log(imgURL);
        img_url = imgURL;
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });

      return img_url;
  }

  uploadEvent(f: NgForm, imgURL: string): void {
    if (!(f.value.title==="") && !(f.value.start_date==="") && !(f.value.start_time==="") && !(f.value.end_date==="") && !(f.value.end_time==="")) {
      this.error_msg = false;
      const json_events = {
        title: f.value.title,
        start_date: f.value.start_date,
        start_time: f.value.start_time,
        end_date: f.value.end_date,
        end_time: f.value.end_time,
        body: f.value.body,
        image: "",  //vorerst noch nix
        category: f.value.cat,
        user: this.user.email,
        status: f.value.stat
      };
      const str_events = JSON.stringify(json_events);
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: this.bearer_token,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: str_events
        
      };
      fetch("/api/events", requestOptions)
        .then(response => response.text())
        .then(result => {
          sessionStorage.setItem("AddEditDeleteCallOnEvent", "true");
          sessionStorage.setItem("EventCreated", "true");
          this.ngOnInit();
        })
        .catch(error => {
          //ggf http status 403 & 401 verarbeiten
          console.log('error', error);
        });
    } else {
      this.error_msg = true;
    }
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

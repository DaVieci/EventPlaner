import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  private user_token: String;
  private bearer_token = ''; 

  private backend_url = 'http://localhost:3000';


  constructor(
    private authService: NbAuthService,
    private http: HttpClient
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("TEST!!!!!!");
    this.getEvents(this.bearer_token);

  }

  ngOnInit(): void {
    this.refreshPageOnTransition();
  }

  refreshPageOnTransition(): void {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
    }
  }

  getEvents(bearer_token: String): void {
    console.log("getEvents call!");
    var url = this.backend_url;
    var method = "GET";
    var req = new XMLHttpRequest();
 
    req.onreadystatechange = function () {
          console.log("BEFORE readyState");
          if (this.readyState == 4 && this.status == 200) {
              console.log(this);
          }
      req.open(method, url+'/events?authorization='+bearer_token, true);
      req.send();
    }
  }

}

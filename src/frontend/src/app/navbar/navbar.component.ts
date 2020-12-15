import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  items: NbMenuItem[] = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/events'
    },
    {
      title: 'Create Event',
      icon: 'plus-square-outline',
      link: '/events/add'
    },
    {
      title: 'About',
      icon: 'people-outline',
      link: '/about'
    },
    {
      title: 'Github',
      icon: 'github-outline',
      url: 'https://github.com/DaVieci/EventPlanner',
      target: '_blank'
    }
  ];

}

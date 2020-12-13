import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  items: NbMenuItem[] = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/'
    },
    {
      title: 'Events',
      icon: 'book-outline',
      link: '/events',
      children: [
        {
          title: 'Upcoming Events',
          icon: 'book-outline',
          link: '/events'
        },
        {
          title: 'Previous Events',
          icon: 'book-outline',
          link: '/events'
        },
        {
          title: 'All',
          icon: 'book-outline',
          link: '/events'
        },
      ]
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      link: '/auth/logout'
    }
  ];

}

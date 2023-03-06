import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgSimpleSidebarService, SimpleSidebarPosition } from 'ng-simple-sidebar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sidebarItems: any[] = [];
  constructor(private ngSimpleSidebarService: NgSimpleSidebarService) { }
  botsideItems$: any;
  ngOnInit() {
    this.sidebarItems = [
      {
        name: 'Departments',
        icon: 'pi pi-map',
        routerLink: ['/welcome'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Products',
        icon: 'fa-solid fa-car-side',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Stock',
        icon: 'fa-solid fa-gear',
        routerLink: ['/welcome'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Dunnage',
        icon: 'pi pi-box',
        routerLink: ['/about'],

        position: SimpleSidebarPosition.top
      },
      {
        name: 'Forecast',
        icon: 'fa-solid fa-arrow-trend-up',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Cycle Check',
        icon: 'fa-regular fa-clipboard',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Sub Assembly',
        icon: 'fa-solid fa-arrow-trend-up',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Production Count',
        icon: 'fa-regular fa-circle-check',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top,
        class: 'hello'
      },
      ,
      {
        name: 'Plants',
        icon: 'fa-solid fa-city',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.bottom
      },
      {
        name: 'Logout',
        icon: 'fa-solid fa-arrow-right-from-bracket',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.bottom
      },
    ];
    // required, configure items
    this.ngSimpleSidebarService.addItems(this.sidebarItems);

    // required, configure icons
    this.ngSimpleSidebarService.configure({
      openIcon: 'pi pi-angle-double-right',
      closeIcon: 'pi pi-angle-double-left',
      colors: {
        "darkMode": false,
        "background": "#133a7c",
        "font": "white",
        "darkModeBackground": "#333",
        "darkModeFont": "#fff"
      },


    });


  }

  ngAfterViewInit() {
    
    this.botsideItems$ = this.ngSimpleSidebarService.getBotsideItems();
    console.log(this.botsideItems$);

  }
}



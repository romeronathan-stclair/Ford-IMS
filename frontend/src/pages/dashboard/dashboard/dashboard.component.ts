import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgSimpleSidebarService, SimpleSidebarPosition } from 'ng-simple-sidebar';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sidebarItems: any[] = [];
  constructor(private plantService: PlantService, private authService: AuthService, private ngSimpleSidebarService: NgSimpleSidebarService) { }
  botsideItems$: any;
  ngOnInit() {
    this.ngSimpleSidebarService.open();

    console.log(this.authService.user);
    this.sidebarItems = [
      {
        name: 'Departments',
        icon: 'pi pi-map',
        routerLink: ['departments/list'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Products',
        icon: 'fa-solid fa-car-side',
        routerLink: ['products/list'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Stock',
        icon: 'fa-solid fa-gear',
        routerLink: ['stock/list'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Dunnage',
        icon: 'pi pi-box',
        routerLink: ['dunnage/list'],

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
        routerLink: ['cycle-check/list'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Sub Assembly',
        icon: 'fa-solid fa-arrow-trend-up',
        routerLink: ['sub-assembly/list'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Production Count',
        icon: 'fa-regular fa-circle-check',
        routerLink: ['production-count/list'],
        position: SimpleSidebarPosition.top,
        class: 'hello'
      },
      {
        name: 'User Management',
        icon: 'fa-solid fa-users',
        routerLink: ['users/list'],
        position: SimpleSidebarPosition.top,
        class: 'hello'

      },
      {
        name: 'Plants',
        icon: 'fa-solid fa-city',
        routerLink: ['plants/list'],
        position: SimpleSidebarPosition.bottom
      },
      {
        name: 'Logout',
        icon: 'fa-solid fa-arrow-right-from-bracket',
        routerLink: ['/signout'],
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
      closeAfterClick: false


    });


  }




  ngAfterViewInit() {

    this.botsideItems$ = this.ngSimpleSidebarService.getBotsideItems();
  }


}

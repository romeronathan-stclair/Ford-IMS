import { Component, OnInit } from '@angular/core';
import { NgSimpleSidebarService, SimpleSidebarPosition } from 'ng-simple-sidebar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sidebarItems: any[] = [];
  constructor(private ngSimpleSidebarService: NgSimpleSidebarService) { }

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
        icon: 'pi pi-map',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
      },
      {
        name: 'Stock',
        icon: 'pi pi-map',
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
        icon: 'pi pi-sync',
        routerLink: ['/about'],
        position: SimpleSidebarPosition.top
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

    // optional, configuration and set states
    this.ngSimpleSidebarService.open();
    this.ngSimpleSidebarService.close();

  }
}

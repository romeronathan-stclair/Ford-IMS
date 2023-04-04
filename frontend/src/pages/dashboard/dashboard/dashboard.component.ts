import { AfterViewInit, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NgSimpleSidebarService, SimpleSidebarPosition } from 'ng-simple-sidebar';
import { interval, Subscription, tap } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { ForecastService } from 'src/services/forecast.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sidebarItems: any[] = [];
  isOpen: boolean = false;
  forecastText: string = '';
  forecastCount: number = 0;
  existingLink: any;
  private isOpenSubscription: Subscription | null = null;
  constructor(private sharedService: SharedService, private el: ElementRef, private renderer: Renderer2, private plantService: PlantService, private authService: AuthService, private ngSimpleSidebarService: NgSimpleSidebarService, private forecastService: ForecastService) {

  }
  botsideItems$: any;
  private updateForecastSubscription: Subscription | null = null;
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
        routerLink: ['forecast/list'],
        position: SimpleSidebarPosition.top,
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

    this.updateForecast();

    this.startUpdatingForecast();
    this.sharedService.activePlantChanged$.subscribe(changed => {
      if (changed) {
        this.updateForecast();

        this.sharedService.refreshDashboardForecast(false);
      } else {

      }
    });

    this.isOpenSubscription = this.ngSimpleSidebarService.isOpen().subscribe(isOpen => {
      this.isOpen = isOpen;
      this.changeSidebar();
    });

  }



  // Create a method that calls getLowPlantForecasts and updates the UI
  updateForecast() {
    this.forecastService.getLowPlantForecasts().subscribe({
      next: (response) => {
        console.log(response);
        if (response.body.lowProductsCount > 0) {
          this.manipulateItemWithTitle("Forecast", response.body.lowProductsCount);
        } else {
          this.resetItemWithTitle("Forecast");
        }
      },
    });
  }
  resetItemWithTitle(title: string) {

    // Get all elements with the 'item' class
    const items = this.el.nativeElement.querySelectorAll('a.menu-item');

    // Find the element with the specified title attribute
    const targetItem = Array.from(items).find((item: any) => item.getAttribute('title') === title) as HTMLElement;
    const parent = targetItem.parentElement;

    // Remove classes from the target item and its parent
    this.renderer.removeClass(targetItem, 'forecast');
    this.renderer.removeClass(parent, 'forecast-holder');

    // Find the existing 'a' tag with the class 'forecast-tag'
    if (parent) {
      const existingLink = parent.querySelector('a.forecast-tag');
      if (existingLink) {
        this.renderer.removeChild(parent, existingLink);
      }
    }


    // If the 'a' tag exists, remove it from the parent

  }


  // Use the interval operator to call the method every 5 minutes
  startUpdatingForecast() {
    const fiveMinutes = 60 * 1000;
    this.updateForecastSubscription = interval(fiveMinutes)
      .pipe(tap(() => this.updateForecast()))
      .subscribe();
  }

  // Implement the OnDestroy lifecycle hook to clean up the subscription
  ngOnDestroy() {
    if (this.updateForecastSubscription) {
      this.updateForecastSubscription.unsubscribe();
    }
    if (this.isOpenSubscription) {
      this.isOpenSubscription.unsubscribe();
    }
  }


  manipulateItemWithTitle(title: string, count: number) {
    // Get all elements with the 'item' class
    const items = this.el.nativeElement.querySelectorAll('a.menu-item');

    // Find the element with the specified title attribute
    const targetItem = Array.from(items).find((item: any) => item.getAttribute('title') === title) as HTMLElement;
    const parent = targetItem.parentElement;
    this.renderer.addClass(targetItem, 'forecast');
    this.renderer.addClass(parent, 'forecast-holder');

    // Check if the 'a' tag with the class 'forecast-tag' is already created
    let existingLink;
    if (parent) {
      existingLink = parent.querySelector('a.forecast-tag');
      this.existingLink = existingLink;
    }

    let displayCount = count > 9999 ? '9999+' : count;
    let text = `${displayCount} PRODUCTS NEED ATTENTION`;
    this.forecastText = text;
    this.forecastCount = count;


    if (existingLink) {
      // If the 'a' tag exists, update the count
      this.renderer.setProperty(existingLink, 'textContent', this.isOpen ? `${text}` : count.toString());
    } else {
      // If the 'a' tag does not exist, create a new one and append it
      const newLink = this.renderer.createElement('a');

      // Set its properties
      this.renderer.setAttribute(newLink, 'href', '#');
      this.renderer.addClass(newLink, 'forecast-tag');
      this.renderer.setProperty(newLink, 'textContent', this.isOpen ? `${text}` : count.toString());

      // Append the new 'a' element to the parent element
      this.renderer.appendChild(parent, newLink);
      this.existingLink = newLink;
    }
  }

  changeSidebar() {
    console.log(this.isOpen);
    if (this.existingLink) {
      console.log("DASDAS");
      this.renderer.setProperty(this.existingLink, 'textContent', this.isOpen ? `${this.forecastText}` : this.forecastCount.toString());
    }
  }




  ngAfterViewInit() {

    this.botsideItems$ = this.ngSimpleSidebarService.getBotsideItems();

  }


}

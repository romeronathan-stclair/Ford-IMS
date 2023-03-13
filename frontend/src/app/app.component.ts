import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  subscription: Subscription;
  title = 'frontend';

  constructor(private sharedService: SharedService, private router: Router) {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // If navigating away from any of the three routes, clear the data
        if (event.url !== '/dashboard/plants/create/step-one' && event.url !== '/dashboard/plants/create/step-two' && event.url !== '/dashboard/plants/create/step-three' && event.url !== '/dashboard/plants/create/step-three-users') {
          this.sharedService.setDataKey('plants');
          this.sharedService.clearData();
        }
        if (event.url !== '/dashboard/stock/create/step-one' && event.url !== '/dashboard/stock/create/step-two' && event.url !== '/dashboard/stock/create/step-three') {
          this.sharedService.setDataKey('stock');
          this.sharedService.clearData();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

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

          this.sharedService.clearData('plants');
        }
        if (event.url !== '/dashboard/users/invite/invite-one-user/step-one'
          && event.url !== '/dashboard/users/invite/invite-one-user/step-two'
          && event.url !== '/dashboard/users/invite/invite-one-user/step-three') {

          this.sharedService.clearData('inviteUser');
        }
        if (event.url !== '/dashboard/stock/create/step-one' && event.url !== '/dashboard/stock/create/step-two' && event.url !== '/dashboard/stock/create/step-three') {
          this.sharedService.clearData('stock');
        }
        if (event.url !== '/dashboard/products/create/step-one' && event.url !== '/dashboard/products/create/step-two' && event.url !== '/dashboard/products/create/step-three' && event.url !== '/dashboard/products/create/step-four') {
          this.sharedService.clearData('product');


        }
        if (event.url !== '/dashboard/dunnage/create/step-one' && event.url !== '/dashboard/dunnage/create/step-two') {
          this.sharedService.clearData('dunnage');
        }
        if (event.url !== '/dashboard/production-count/create/step-one' && event.url !== '/dashboard/production-count/create/step-two') {
          this.sharedService.clearData('productionCount');
        }
        if (event.url !== '/dashboard/users/invite/invite-multiple') {
          this.sharedService.clearData('invite-multiple');
        }
        if (event.url !== '/dashboard/users/edit/reassign-plants' && event.url !== '/dashboard/users/edit/reassign-departments') {
          this.sharedService.clearData('editUser');
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-signout-page',
  templateUrl: './signout-page.component.html',
  styleUrls: ['./signout-page.component.scss']
})
export class SignoutPageComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router,) { }
  timer: number = 5;
  timerSub: any;
  timeoutSub: any;


  ngOnInit() {
    this.authService.signout().subscribe({
      next: (response) => {
        this.authService.user = null as any;


        this.timerSub = setInterval(() => {
          this.timer--;
          console.log(this.timer);
        }, 1000);


        this.timeoutSub = setTimeout(() => {

          this.router.navigate(['/account/login']);
        }, 5000);


      },
      error: (err) => {
        
        console.log('THERE WAS AN ERROR ' + JSON.stringify(err));
        this.timerSub = setInterval(() => {
          this.timer--;
        }, 1000);

        this.timeoutSub = setTimeout(() => {

          this.router.navigate(['/account/login']);
        }, 5000);

        // TODO
      },
    });

  }
  ngOnDestroy() {
    if (this.timerSub) {
      clearInterval(this.timerSub);
      clearTimeout(this.timeoutSub);
    }
  }

}

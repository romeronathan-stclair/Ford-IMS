import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  timer: number = 5;
  timerSub: any;
  timeoutSub: any;

  constructor(private location: Location) { }

  ngOnInit() {
    this.timerSub = setInterval(() => {
      this.timer--;
    }, 1000);


    this.timeoutSub = setTimeout(() => {

      this.location.back();
    }, 5000);
  }

  goBack() {
    clearInterval(this.timerSub);
    clearTimeout(this.timeoutSub);
    this.location.back();
  }

  ngOnDestroy() {
    clearInterval(this.timerSub);
    clearTimeout(this.timeoutSub);
  }

}

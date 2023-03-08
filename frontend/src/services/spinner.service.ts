import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public spinnerService: NgxSpinnerService;
  constructor(private spinner: NgxSpinnerService) { 
    this.spinnerService = spinner;
  }

  hide() {
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
  }
  show() {
    this.spinner.show();
  }
  showHide() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
  }

}

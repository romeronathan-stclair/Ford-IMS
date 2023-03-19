import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { CycleCheckService } from 'src/services/cyclecheck.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cycle-check-step-one',
  templateUrl: './cycle-check-step-one.component.html',
  styleUrls: ['./cycle-check-step-one.component.scss']
})
export class CycleCheckStepOneComponent {
  activePlantId: string = '';
  cycleCheck: any;

  constructor(
    private authService: AuthService,
    private cycleCheckService: CycleCheckService,
    private spinnerService: SpinnerService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.activePlantId = this.authService.user.activePlantId;
    this.loadCycleCheck();
  }

  incrementCountStock(stock: any) {
    stock.currentCount++;
  }

  decrementCountStock(stock: any) {
    if (stock.currentCount > 0) {
      stock.currentCount--;
    }
  }

  incrementCountDunnage(dunnage: any) {
    dunnage.currentCount++;
  }

  decrementCountDunnage(dunnage: any) {
    if (dunnage.currentCount > 0) {
      dunnage.currentCount--;
    }
  }


  loadCycleCheck() {
    this.spinnerService.show();

    this.cycleCheckService.getCycleCheck()
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.cycleCheck = data.body;
        console.log(this.cycleCheck);
      },
      error: (err: any) => {
        this.spinnerService.hide();
        console.log(err);
      }
    });
  }

  onSubmit() {

  }


}

import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { CycleCheckService } from 'src/services/cyclecheck.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cycle-check-step-one',
  templateUrl: './cycle-check-step-one.component.html',
  styleUrls: ['./cycle-check-step-one.component.scss']
})
export class CycleCheckStepOneComponent {
  activePlantId: string = '';
  cycleCheck: any;
  confirm = false;

  constructor(
    private authService: AuthService,
    private cycleCheckService: CycleCheckService,
    private spinnerService: SpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
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

        this.cycleCheck.forEach((department: any) => {
          department.stockList.forEach((stock: any) => stock.currentCount = 0);
          department.dunnage.forEach((dunnage: any) => dunnage.currentCount = 0);
        });
      },
      error: (err: any) => {
        this.spinnerService.hide();
        console.log(err);
      }
    });
  }

  validateInputs(): boolean {
    let isValid = true;

    this.cycleCheck.forEach((department: any) => {
      department.stockList.forEach((stock: any) => {
        if (stock.currentCount === null) {
          isValid = false;
          return;
        }
      });

      department.dunnage.forEach((dunnage: any) => {
        if (dunnage.currentCount === null) {
          isValid = false;
          return;
        }
      });
    });

    return isValid;
  }


  confirmCheck() {
    if (!this.validateInputs()) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter all the values'
      });
      return;
    }

    this.spinnerService.showHide();
    this.confirm = true;
    const scrollToTop = document.querySelector('.table-header');
    scrollToTop?.scrollIntoView({ behavior: 'auto' });
  }

  cancelCheck() {
    this.spinnerService.showHide();
    this.confirm = false;
    const scrollToTop = document.querySelector('.table-header');
    scrollToTop?.scrollIntoView({ behavior: 'auto' });
  }

  submitCount() {
    this.spinnerService.show();

    console.log(this.cycleCheck);
    let request = {
      cycleCheckList: this.cycleCheck
    }

    this.cycleCheckService.submitCycleCheck(request)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cycle Check Submitted Successfully'
        });
        this.router.navigate(['/dashboard/cycle-check/list']);
      },
      error: (err: any) => {
        this.spinnerService.hide();
        console.log(err);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Submitting Cycle Check'
        });
      }
    });
  }


}

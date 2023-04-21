import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { SubAssemblyService } from 'src/services/subassembly.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HelpDialogComponent } from 'src/components/help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sub-assembly-step-one',
  templateUrl: './sub-assembly-step-one.component.html',
  styleUrls: ['./sub-assembly-step-one.component.scss']
})
export class SubAssemblyStepOneComponent {
  activePlantId: string = '';
  subAssembly: any;
  confirm = false;

  constructor(
    private authService: AuthService,
    private subAssemblyService: SubAssemblyService,
    private spinnerService: SpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activePlantId = this.authService.user.activePlantId;
    this.loadSubAssembly();
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

  openHelpDialog(item: any) {
    const helpItem = item;

    const dialogRef = this.dialog.open(HelpDialogComponent, {
      data: {
        name: helpItem.name,
        imageURL: helpItem.imageURL,
        marketLocation: helpItem.marketLocation,
        partNumber: helpItem.partNumber,
      }
    });
  }

  loadSubAssembly() {
    this.spinnerService.show();

    this.subAssemblyService.getSubAssembly()
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.subAssembly = data.body;
        this.subAssembly.forEach((department: any) => {
          department.stockList.forEach((stock: any) => stock.currentCount = null);
        });

        const emptyDepartments = this.subAssembly.filter((department: any) => department.stockList.length === 0);
        if (emptyDepartments.length === this.subAssembly.length) {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No Sub Assembly Stock Found'
          });
          this.location.back();
        }

      },
      error: (err: any) => {
        this.spinnerService.hide();
      }
    });
  }

  validateInputs(): boolean {
    let isValid = true;

    this.subAssembly.forEach((department: any) => {
      department.stockList.forEach((stock: any) => {
        if (stock.currentCount === null) {
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

    let request = {
      subAssemblyList: this.subAssembly
    }

    this.subAssemblyService.submitSubAssembly(request)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Sub Assembly Submitted Successfully'
        });
        this.router.navigate(['/dashboard/sub-assembly/list']);
      },
      error: (err: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Submitting Sub Assembly'
        });
      }
    })

  }


}

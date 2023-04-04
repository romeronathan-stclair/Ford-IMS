import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HelpDialogComponent } from 'src/components/help-dialog/help-dialog.component';
import { Product } from 'src/models/product';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { DepartmentCount, ProductionCountRequest } from 'src/models/requests/productionCountRequest';
import { ProductionCountService } from 'src/services/productionCount.service';
import { Plant } from 'src/models/plant';
import { Department } from 'src/models/department';
@Component({
  selector: 'app-production-count-step-two',
  templateUrl: './production-count-step-two.component.html',
  styleUrls: ['./production-count-step-two.component.scss']
})
export class ProductionCountStepTwoComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roles: any[] = [];
  plants: Plant[] = [];
  selectedDepartment: Department = {} as Department;
  departments: Department[] = [];
  products: Product[] = [];
  selectedProducts: Product[] = [];
  confirm = false;
  productionCountRequest: ProductionCountRequest | undefined;


  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private departmentService: DepartmentService,
    private productService: ProductService,
    private productionCountService: ProductionCountService) {

    this.sharedService.setDataKey('productionCount');
    if (this.sharedService.getData() != null) {
      this.request = this.sharedService.getData();
      this.productionCountRequest = this.request;
      console.log(this.productionCountRequest);
      console.log(this.request);





    }





  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {


  }
  incrementProductQty(product: Product) {
    product.productQtyBuilt!++;
    this.sharedService.setData(this.request);
  }

  decrementProductQty(product: Product) {
    if (product.productQtyBuilt! > 0) {
      product.productQtyBuilt!--;
      this.sharedService.setData(this.request);
    }

  }
  openHelpDialog(item: any) {
    const helpItem = item;
    console.log(helpItem);

    const dialogRef = this.dialog.open(HelpDialogComponent, {
      data: {
        name: helpItem.name,
        imageURL: helpItem.imageURL,
        marketLocation: helpItem.marketLocation,
        partNumber: helpItem.partNumber,
      }
    });
  }

  validateInputs(): boolean {
    let isValid = true;

    this.request.productionCountRequest.forEach((departmentCount: DepartmentCount) => {
      departmentCount.productList.forEach((product: any) => {
        if (product.productQtyBuilt === 0 || product.productQtyBuilt === null) {
          isValid = false;
        }
      });
    }
    );

    return isValid;
  }
  submitCount() {
    this.spinnerService.show();

    this.productionCountService.submitProductionCount(this.request)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Production Count Submitted Successfully'
          });
          console.log(data);
          this.router.navigate(['/dashboard/production-count/list']);
        },
        error: (err: any) => {
          this.spinnerService.hide();
          console.log(err);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Submitting Production Count'
          });
        }
      });
  }


  confirmCount() {
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

  cancelCount() {
    this.spinnerService.showHide();
    this.confirm = false;
    const scrollToTop = document.querySelector('.table-header');
    scrollToTop?.scrollIntoView({ behavior: 'auto' });
  }

}

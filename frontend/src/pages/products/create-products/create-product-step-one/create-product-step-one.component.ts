import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ProductService } from 'src/services/product.service';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';
import { Department } from 'src/models/department';

@Component({
  selector: 'app-create-product-step-one',
  templateUrl: './create-product-step-one.component.html',
  styleUrls: ['./create-product-step-one.component.scss']
})
export class CreateProductStepOneComponent {
  public displayValidationErrors: boolean = false;
  productForm: FormGroup;
  request: any;
  roughproductChecked = false;
  subAssemblyChecked = false;
  departments: Department[] = [];
  selectedDepartment: Department = {} as Department;
  activePlantId: string = '';

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private messageService: MessageService) {
    this.productForm = this.formBuilder.group({
      name: new FormControl(''),
      partNumber: new FormControl(''),
      marketLocation: new FormControl(''),
      dailyTarget: new FormControl(''),
      department: new FormControl(''),

    });
    this.sharedService.setDataKey('product');
    if (this.sharedService.getData() != null) {
      this.request = this.sharedService.getData();
      this.productForm.patchValue(
        this.request.product
      );
      if (this.request.product && this.request.product.department != null) {
        this.selectedDepartment = this.request.product.department;
      }
    }

  }

  ngAfterViewInit() {

  }


  async ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;
    await this.loadDepartments();
  }


  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.activePlantId;

    this.departmentService.getDepartments(departmentQuery).subscribe({
      next: (data: any) => {
        this.departments = data.body.departments;
      },
      error: (err: any) => {
      }
    });
  }
  changeDepartment($event: any) {


  }

  onSubmit() {
    if(this.selectedDepartment.departmentName == null) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a department' });
    }
    if (!this.productForm.valid || this.selectedDepartment == null) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }

    this.spinnerService.show();

    let totalproduct = this.productForm.value.productQtyPerTote * this.productForm.value.totesPerSkid;
    let moderateproduct = 0;

    if (this.roughproductChecked === true) {
      moderateproduct = this.productForm.value.lowproduct * 2;
    } else {
      moderateproduct = this.productForm.value.lowproduct + 2;
    }

    const product = {
      name: this.productForm.value.name,
      partNumber: this.productForm.value.partNumber,
      marketLocation: this.productForm.value.marketLocation,
      dailyTarget: this.productForm.value.dailyTarget,
      department: this.selectedDepartment,

    };

    this.request.product = product;
    this.sharedService.setData(this.request);

    let query = "?name=" + product.name;

    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        if (data.body.products && data.body.products.length > 0) {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'product already exists' });
          return;
        }
        this.router.navigate(['/dashboard/products/create/step-two']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        return;
      }
    });

  }


}

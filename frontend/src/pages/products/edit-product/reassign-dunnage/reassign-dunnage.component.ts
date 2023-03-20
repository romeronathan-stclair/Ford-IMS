import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { DunnageService } from 'src/services/dunnage.service';
import { ProductService } from 'src/services/product.service';
import { ProductDunnageService } from 'src/services/productDunnage.service';

import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-reassign-dunnage',
  templateUrl: './reassign-dunnage.component.html',
  styleUrls: ['./reassign-dunnage.component.scss']
})
export class ReassignDunnageComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roughproductChecked = false;
  subAssemblyChecked = false;
  departments: any[] = [];
  selectedDepartment: any;
  activePlantId: any;
  dunnage: any[] = [];
  productId: any;
  productDunnage: any[] = [];
  product: any;
  targetDunnage: any[] = [];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private messageService: MessageService,
    private dunnageService: DunnageService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private productDunnageService: ProductDunnageService) {




  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.loadProductData();
    });
  }
  loadProductData() {
    this.spinnerService.show();
    let query = "?productId=" + this.productId;
    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();

        if (data.body.products && data.body.products.length > 0) {
          // populate the form controls with the product data
          this.product = data.body.products[0];
          this.loadProductDunnages();

        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to get product data.`,
        });
        return;
      }
    });
  }
  loadDunnages() {
    let dunnageQuery = `?departmentId=${this.product.departmentId}&plantId=${this.authService.user.activePlantId}`;

    this.dunnageService.getDunnages(dunnageQuery).subscribe({
      next: (data: any) => {

        this.spinnerService.hide();
        if (this.productDunnage && this.productDunnage.length > 0) {
          this.dunnage = data.body.dunnages.filter((dunnage: any) => {
            return !this.productDunnage.find((productDunnage: any) => productDunnage.dunnageId === dunnage._id);
          });

          this.targetDunnage = data.body.dunnages.filter((dunnage: any) => {
            return this.productDunnage.find((productDunnage: any) => productDunnage.dunnageId === dunnage._id);
          });


        } else {
          this.dunnage = data.body.dunnages;
        }

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
      }
    });

  }
  loadProductDunnages() {
    let dunnageQuery = `?productId=${this.productId}`;
    console.log(dunnageQuery);
    this.productDunnageService.getProductDunnage(dunnageQuery).subscribe({
      next: (data: any) => {

        this.productDunnage = data.body.productDunnage;
        this.loadDunnages();

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
      }
    });

  }

  moveToTarget($event: any) {

    if (this.targetDunnage.length > 1) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You can only add one dunnage' });
      this.targetDunnage = this.targetDunnage.filter((dunnage: any) => dunnage._id !== $event.items[0]._id);
      this.dunnage.push($event.items[0]);
      return;
    }

  }
  openDialog($event: any) {

    const dunnage = $event.items[0];

    const dialogRef = this.dialog.open(UsePerDialogComponent, {

      data: {
        title: 'Amount of dunnage used per product',
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.targetDunnage.find((dunnage: any) => dunnage._id === $event.items[0]._id).usePerProduct = result;
      } else {
        this.targetDunnage = this.targetDunnage.filter((dunnage: any) => dunnage._id !== $event.items[0]._id);
        this.dunnage.push($event.items[0]);
        return;
      }

    });
  }
  moveBack($event: any) {
    const dunnage = $event.items[0];

  }

  submit() {

    this.productService.reassignProductDunnage({
      dunnage: this.targetDunnage,
      productId: this.productId
    }).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Product dunnage reassigned successfully.`,
        });
        this.router.navigate(['/dashboard/products/list']);

      }
      ,
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to reassign product dunnage.`,
        });
      }
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ProductService } from 'src/services/product.service';
import { Router } from '@angular/router';
import { Product } from 'src/models/product';
import { Department } from 'src/models/department';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductService, ConfirmationService]
})
export class ProductListComponent {
  currentPage = 0;
  length = 0;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';
  productForm: FormGroup;
  selectedDepartment: any;
  departments: Department[] = [];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  products: Product[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private router: Router,
    public roleService: RoleService,
    private authService: AuthService) {
    this.productForm = new FormGroup({
      productName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    console.log(this.activePlantId);
    if (this.activePlantId != '0') {
      this.loadData();
    }
  }

  ngAfterViewInit() {

  }

  async loadData() {
    this.spinnerService.show();
    await this.loadDepartments();
    await this.loadProducts();
    this.spinnerService.hide();
  }

  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.activePlantId + "&userId=" + this.authService.user._id;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
          this.departments.unshift({ _id: '', departmentName: 'All Departments', plantId: '', isDeleted: false });
          resolve();
        },
        error: (error: any) => {
          reject(error);

        }
      });
    });
  }

  async loadProducts(query: string = '') {
    const selectedDepartmentId = this.selectedDepartment ? this.selectedDepartment._id : this.departments[0]._id;
    let productQuery = `?departmentId=${selectedDepartmentId}&page=${this.currentPage}&pageSize=${this.pageSize}`;
    if (query) {
      productQuery += query;
    }

    return new Promise<void>((resolve, reject) => {
      this.productService.getProducts(productQuery).subscribe({
        next: (data: any) => {
          console.log(data);
          this.products = data.body.products;
          this.length = data.body.productCount;
          this.dataSource = new MatTableDataSource(this.products);
          resolve();
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  pageChanged(event: PageEvent) {
    if (this.activePlantId == '0') {
      return;
    }
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.loadData();
  }

  searchByName() {
    const nameControl = this.productForm.get('productName');

    if (nameControl) {
      const name = nameControl.value;

      let query = `&name=${name}`;

      this.loadProducts(query);
    }
  }

  changeDepartment($event: any) {
    this.loadData();
  }

  deleteProduct(productId: any) {
    this.confirmationService.confirm({

      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.spinnerService.show();

        this.productService.deleteProduct(productId)
          .subscribe({
            next: (data: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product deleted successfully'
              });
              this.loadData();
            },
            error: (error: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting product'
              });
            }
          });
      },
      reject: () => {
        //reject action
      }
    });
  }

  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/product']);
  }

}

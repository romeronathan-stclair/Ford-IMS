import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  productForm: FormGroup;
  selectedDepartment: any;
  departments: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  products: any[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private authService: AuthService) {
    this.productForm = new FormGroup({
      productName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    this.loadData();
  }

  ngAfterViewInit() {

  }

  loadData() {
    this.spinnerService.show();

    let departmentQuery = "?plantId=" + this.activePlantId;

    let departmentIds: string[] = [];
    this.departmentService.getDepartments(departmentQuery)
      .subscribe({
        next: (data: any) => {
          data.body.departments.forEach((department: any) => {
            departmentIds.push(department._id);
          });
          this.departments = data.body.departments;

          console.log(departmentIds);

          let productQuery = "?departmentId=" + departmentIds[0] + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

          this.productService.getProducts(productQuery)
            .subscribe({
              next: (data: any) => {
                console.log(data);
                this.spinnerService.hide();
                this.products = data.body.products;
                this.length = data.body.productCount;
                console.log(this.products);
                this.dataSource = new MatTableDataSource(this.products);

              },
              error: (error: any) => {
                this.spinnerService.hide();
                console.log(error);
              }
            });
        },
        error: (error: any) => {
          console.log(error);
        }
      });

    console.log(this.products);
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  searchByName() {
    const nameControl = this.productForm.get('productName');

    if (nameControl) {
      const name = nameControl.value;

      let query = "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

      this.productService.getProducts(query)
        .subscribe({
          next: (data) => {
            this.length = data.body.productCount;
            this.products = data.body.product;
            this.dataSource = new MatTableDataSource(this.products);
          }
        })
    }
  }

  changeDepartment($event: any) {
    console.log(this.selectedDepartment);

    this.spinnerService.show();

    if (this.selectedDepartment.departmentName == "All Departments") {
      this.loadData();
    }
    else {
      let productQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}&departmentId=${this.selectedDepartment._id}`;
      console.log(productQuery);
      this.productService.getProducts(productQuery).subscribe({
        next: (data: any) => {
          console.log(data);
          this.spinnerService.hide();
          this.products = data.body.products;
          this.length = data.body.productCount;
          this.dataSource = new MatTableDataSource(this.products);
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
    }
  }



}

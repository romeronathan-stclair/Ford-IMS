import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Plant } from 'src/models/plant';
import { Product } from 'src/models/product';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { DepartmentCount, ProductionCountRequest } from 'src/models/requests/productionCountRequest';
@Component({
  selector: 'app-production-count-step-one',
  templateUrl: './production-count-step-one.component.html',
  styleUrls: ['./production-count-step-one.component.scss']
})
export class ProductionCountStepOneComponent {
  public displayValidationErrors: boolean = false;

  roles: any[] = [];
  plants: any[] = [];
  selectedDepartment: any;
  departments: any[] = [];
  products: any[] = [];
  selectedProducts: Product[] = [];
  request: ProductionCountRequest;
  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private productService: ProductService) {

    this.sharedService.setDataKey('productionCount');
    if (this.sharedService.getData() != null && this.sharedService.getData().productionCountRequest) {

      this.request = this.sharedService.getData();


      if (this.request.productionCountRequest) {
        this.selectedProducts = this.request.productionCountRequest.reduce((acc: Product[], departmentCount: DepartmentCount) => {
          return acc.concat(departmentCount.productList);
        }, []);

      }
    }
    else {
      console.log('else');
      this.request = {
        productionCountRequest: []
      };
    }


    console.log(this.request);


  }
  ngAfterViewInit() {

  }
  async ngOnInit() {

    await this.loadDepartments();
    await this.loadNextDepartmentWithProducts();


  }


  onSubmit() {
    this.spinnerService.show();

    this.spinnerService.hide();

    this.sharedService.setData(this.request);

    this.router.navigate(['/dashboard/production-count/create/step-two']);

  }
  onCheckboxChange(event: any, product: Product) {
    console.log(product);

    if (event.checked) {
      this.addProductToRequest(product);
    } else {
      this.removeProductFromRequest(product);
    }

    this.sharedService.setData(this.request);
  }

  async addProductToRequest(product: Product) {
    const department = this.request.productionCountRequest.find((departmentCount: DepartmentCount) => departmentCount.departmentId === product.departmentId);
    product.productQtyBuilt = 0;
    if (department) {
      department.productList.push(product);
    }
    else {
      this.request.productionCountRequest.push({
        departmentId: product.departmentId,
        departmentName: this.selectedDepartment.departmentName,
        productList: [product]
      });
    }
    this.selectedProducts.push(product);

    this.sharedService.setData(this.request);
  }
  removeProductFromRequest(product: Product) {
    if (this.request) {
      const department = this.request.productionCountRequest.find(
        (dept: DepartmentCount) => dept.departmentId === product.departmentId
      );

      if (department) {
        department.productList = department.productList.filter(
          (selectedProduct: Product) => selectedProduct._id !== product._id
        );
      }
    }
    this.selectedProducts.splice(this.selectedProducts.indexOf(product), 1);
    this.sharedService.setData(this.request);
  }



  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.authService.user.activePlantId + "&userId=" + this.authService.user._id;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
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
    let productQuery = `?departmentId=${selectedDepartmentId}`;
    if (query) {
      productQuery += query;
    }

    return new Promise<void>((resolve, reject) => {
      this.productService.getProducts(productQuery).subscribe({
        next: (data: any) => {
          console.log(data);
          this.products = data.body.products.map((product: any) => {
            const existingProduct = this.selectedProducts.find((selectedProduct: any) => selectedProduct._id === product._id);
            return {
              ...product,
              checked: existingProduct ? true : false
            };
          });

          resolve();
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }
  async loadData() {

    await this.loadDepartments();
    await this.loadProducts();

  }

  changeDepartment($event: any) {
    this.loadData();
  }
  async loadNextDepartmentWithProducts() {
    this.spinnerService.show();
    for (let department of this.departments) {
      this.selectedDepartment = department;
      await this.loadProducts();
      if (this.products.length > 0) {
        this.spinnerService.hide();
        break;

      }
    }
  }
}

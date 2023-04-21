import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ProductService } from 'src/services/product.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent {
  productId: string = '';
  product: any;
  departmentId: string = '';
  departmentName: string = '';
  departments: any[] = [];


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadData();
    })
  }

  async loadData() {
    this.spinnerService.show();

    let productQuery = "?productId=" + this.productId;

    this.productService.getProducts(productQuery)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.product = data.body.products[0];
          this.departmentId = this.product.departmentId;

          let departmentQuery = "?plantId=" + this.authService.user.activePlantId + "&departmentId=" + this.departmentId;

          this.departmentService.getDepartments(departmentQuery)
            .subscribe({
              next: (data: any) => {
                this.spinnerService.hide();
                this.departmentName = data.body.departmentName;
              },
              error: (error: any) => {
                this.spinnerService.hide();
              }
            });

        },
        error: (error: any) => {
          this.spinnerService.hide();
        }
      });


  }
  back() {
    this.location.back();
  }

}

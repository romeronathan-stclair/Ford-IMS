import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-edit-product-information',
  templateUrl: './edit-product-information.component.html',
  styleUrls: ['./edit-product-information.component.scss']
})
export class EditProductInformationComponent {
  public displayValidationErrors: boolean = false;
  productForm: FormGroup;
  product: Product = {} as Product;
  productId: string = ''; // add a variable to hold the product id
  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute, // add ActivatedRoute to the constructor
    private location: Location,

    private spinnerService: SpinnerService,
    private messageService: MessageService) {

    this.productForm = this.formBuilder.group({
      name: new FormControl(''),
      partNumber: new FormControl(''),
      dailyTarget: new FormControl(''),
      marketLocation: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id']; // get the product id from the route params
      this.loadProductData(); // call a method to load the product data
    });
  }

  loadProductData() {
    this.spinnerService.show();
    let query = "?productId=" + this.productId;
    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log(data);
        if (data.body.products && data.body.products.length > 0) {
          // populate the form controls with the product data
          this.product = data.body.products[0];
          this.product.productId = data.body.products[0]._id;
          console.log(this.product);
          this.productForm.patchValue({
            name: data.body.products[0].name,
            partNumber: data.body.products[0].partNumber,
            dailyTarget: data.body.products[0].dailyTarget,
            marketLocation: data.body.products[0].marketLocation
          });
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

  onSubmit() {
    if (!this.productForm.valid) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }
    this.spinnerService.show();
    this.product.name = this.productForm.value.name;
    this.product.partNumber = this.productForm.value.partNumber;
    this.product.dailyTarget = this.productForm.value.dailyTarget;
    this.product.marketLocation = this.productForm.value.marketLocation;

    const formData = new FormData();

    formData.append('product', JSON.stringify(this.product));







    this.productService.editProduct(formData).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log(data);
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Plant data updated successfully.`,
        });

        this.router.navigate(['/dashboard/products/list']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to update product data.`,
        });
        return;

      }
    });
  }
  back() {
    this.location.back();
  }

}

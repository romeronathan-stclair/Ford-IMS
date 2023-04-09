import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/models/product';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';

@Component({
  selector: 'app-change-product-picture',
  templateUrl: './change-product-picture.component.html',
  styleUrls: ['./change-product-picture.component.scss']
})
export class ChangeProductPictureComponent {
  public displayValidationErrors: boolean = false;
  product: Product = {} as Product;
  public imageUrl: string = '';
  file: any;
  productId: string = '';
  public showOverlay: boolean = false;
  public isImageUploaded: boolean = false;

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private stockService: StockService,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private productService: ProductService,
    private route: ActivatedRoute, // add ActivatedRoute to the constructor

    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {

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

          this.imageUrl = this.product.imageURL;
          console.log(this.imageUrl);


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
  onImageHover(show: boolean) {
    this.showOverlay = show;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader = new FileReader();
      this.file = file;

      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;


        this.showOverlay = true; // set to true to show the replace button
      };

      reader.readAsDataURL(file);
    }
  }



  onBrowseClick(): void {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  onSubmit() {
    //check if an image exists before moving on

    const formData: FormData = new FormData();
    if (this.file) {
      formData.append('file', this.file);
    }

    formData.append('product', JSON.stringify(this.product));



    this.productService.editProduct(formData).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Product updated successfully.`,
        });
        console.log(data);
        this.router.navigate(['/dashboard/products/list']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to update product.`,
        });
        return;
      }
    });


  }
}

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { DunnageService } from 'src/services/dunnage.service';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-create-product-step-four',
  templateUrl: './create-product-step-four.component.html',
  styleUrls: ['./create-product-step-four.component.scss']
})
export class CreateProductStepFourComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roughproductChecked = false;
  subAssemblyChecked = false;
  departments: any[] = [];
  selectedDepartment: any;
  activePlantId: any;
  dunnages: any[] = [];
  targetDunnages: any[] = [];

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
    public dialog: MatDialog) {

    this.sharedService.setDataKey('product');
    if (this.sharedService.getData() != null) {
      this.request = this.sharedService.getData();
      this.selectedDepartment = this.request.product.department;


      console.log(this.request);
      if (!this.request.product.dunnages) {
        this.request.product.dunnages = [];
      }
    }


  }
  async ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;

    await this.loaddunnages();
  }

  loaddunnages() {
    let dunnageQuery = `?departmentId=${this.selectedDepartment._id}&plantId=${this.authService.user.activePlantId}`;
    console.log(dunnageQuery);
    this.dunnageService.getDunnages(dunnageQuery).subscribe({
      next: (data: any) => {
        console.log(data);
        this.spinnerService.hide();
        this.dunnages = data.body.dunnages;
        if (this.request.product.dunnages && this.request.product.dunnages.length > 0) {
          this.targetDunnages = this.dunnages.filter((dunnage: any) => {
            return this.request.product.dunnages.findIndex((targetdunnage: any) => targetdunnage._id === dunnage._id) !== -1;
          }
          );
          this.dunnages = this.dunnages.filter((dunnage: any) => {
            return this.targetDunnages.findIndex((targetdunnage: any) => targetdunnage._id === dunnage._id) === -1;
          }
          );
        }

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
      }
    });

  }

  openDialog($event: any) {

    const dunnage = $event.items[0];
    console.log(dunnage);





    const dialogRef = this.dialog.open(UsePerDialogComponent, {

      data: {
        title: 'Amount of dunnage used per product',
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result) {
        const productdunnage = {
          _id: dunnage._id,
          usePer: result
        }

        this.request.product.dunnages.push(productdunnage);
        this.sharedService.setData(this.request);
        console.log(productdunnage);
      }



    });
  }
  moveBack($event: any) {
    const dunnage = $event.items[0];


    this.request.product.dunnages = this.request.product.dunnages.filter((productdunnage: any) => productdunnage._id !== dunnage._id);
    this.sharedService.setData(this.request);


  }

  submit() {

    const formData = new FormData();

    if (this.request.file) {
      const file = this.imageUrlToFile(this.request.file);
      console.log(file);
      formData.append('file', file);
    }

    const createProductRequest = {
      departmentId: this.request.product.department._id,
      productId: this.request.product._id,
      name: this.request.product.name,
      partNumber: this.request.product.partNumber,
      stocks: this.request.product.stocks ? this.request.product.stocks : [],
      dunnages: this.request.product.dunnages ? this.request.product.dunnages : [],

    } as any;

    for (const key in createProductRequest) {
      formData.append(key, createProductRequest[key]);
    }


    this.productService.createProduct(this.request).subscribe({
      next: (data: any) => {
        console.log(data);
        this.spinnerService.hide();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product created successfully' });
        this.router.navigate(['/dashboard/products/list']);
      }, error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating product' });
      }

    });







  }
  // Function to convert imageUrl (base64 string) back to a File
  imageUrlToFile(imageUrl: string, filename: string = ""): File {
    // Remove data URL prefix (if present)
    const base64 = imageUrl.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');

    // Convert base64 string to ArrayBuffer
    const arrayBuffer = this.base64ToArrayBuffer(base64);
    const contentType = this.getContentTypeFromImageUrl(imageUrl);
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: contentType });

    // Create a File object from the Blob
    const file = new File([blob], filename, { type: contentType });

    return file;
  }


  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }
  getContentTypeFromImageUrl(imageUrl: string): string {
    const contentTypeRegex = /data:([^;]+);/i;
    const match = contentTypeRegex.exec(imageUrl);

    return match ? match[1] : '';
  }
}
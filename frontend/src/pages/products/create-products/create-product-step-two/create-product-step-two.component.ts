import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';

@Component({
  selector: 'app-create-product-step-two',
  templateUrl: './create-product-step-two.component.html',
  styleUrls: ['./create-product-step-two.component.scss']
})
export class CreateProductStepTwoComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  public imageUrl: string = '';
  file: any;
  public showOverlay: boolean = false;
  public isImageUploaded: boolean = false;

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private stockService: StockService,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {
    this.sharedService.setDataKey('product');
    this.request = this.sharedService.getData();

    if (this.request == null) {
      this.router.navigate(['/products/create/step-one']);
      return;
    } else {
      this.request = this.sharedService.getData();
      this.imageUrl = this.request.file;
    }





  }

  async ngOnInit() {
    this.spinnerService.showHide();
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
        this.request.file = this.imageUrl;

        // Save the image as a base64 string in localStorage
        this.sharedService.setData(this.request);

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


    this.spinnerService.showHide();

    this.request.file = this.imageUrl;



    this.sharedService.setData(this.request);

    this.router.navigate(['/dashboard/products/create/step-three']);
  }
}

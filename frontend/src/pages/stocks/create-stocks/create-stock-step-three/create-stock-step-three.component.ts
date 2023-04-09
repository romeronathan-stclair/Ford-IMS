import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-create-stock-step-three',
  templateUrl: './create-stock-step-three.component.html',
  styleUrls: ['./create-stock-step-three.component.scss']
})
export class CreateStockStepThreeComponent implements AfterViewInit {
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
    this.sharedService.setDataKey('stock');
    this.request = this.sharedService.getData();
  }

  async ngOnInit() {
    this.spinnerService.showHide();
  }

  ngAfterViewInit() {
    this.sharedService.setDataKey('stock');
    this.request = this.sharedService.getData();
    console.log(this.request);
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

    this.spinnerService.show();

    const stock = {
      departmentId: this.request.stock.selectedDepartment._id,
      name: this.request.stock.name,
      partNumber: this.request.stock.partNumber,
      totalStockPerSkid: this.request.stock.totalStockPerSkid,
      stockQtyPerTote: this.request.stock.stockQtyPerTote || null,
      totesPerSkid: this.request.stock.totesPerSkid || null,
      roughStock: this.request.stock.roughStock,
      lowStock: this.request.stock.lowStock,
      moderateStock: this.request.stock.moderateStock,
      marketLocation: this.request.stock.marketLocation,
      isSubAssembly: this.request.stock.subAssembly
    }

    const formData: FormData = new FormData();

    formData.append('file', this.file);
    formData.append('stock', JSON.stringify(stock));

    this.stockService.createStock(formData).subscribe({
      next: (response) => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock created successfully',
        });
        this.spinnerService.hide();
        this.router.navigate(['/dashboard/stock/create/success']);
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error}`,
        });
      }
    });

  }

}

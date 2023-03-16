import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-edit-stock-image',
  templateUrl: './edit-stock-image.component.html',
  styleUrls: ['./edit-stock-image.component.scss']
})
export class EditStockImageComponent {
  public displayValidationErrors: boolean = false;
  public imageUrl: string = '';
  file: any;
  public showOverlay: boolean = false;
  public isImageUploaded: boolean = false;
  stockId: string = '';

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private stockService: StockService,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.stockId = params['id'];
      this.loadStockData();
    })
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

  loadStockData() {
    this.spinnerService.show();
    let query = "?stockId=" + this.stockId;

    this.stockService.getStocks(query)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.imageUrl = data.body.stocks[0].imageURL;
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to get dunnage data.`,
        });
        return;
      }
    })

  }

  stockInfo() {
    this.router.navigate(['/dashboard/stock/edit/info/' + this.stockId]);
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('stockId', this.stockId);

    if (this.file) {
      formData.append('file', this.file);
    }

    this.spinnerService.show();

    this.stockService.editStock(formData)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Stock updated successfully.`,
        });
        this.router.navigate(['/dashboard/stock/edit/info/' + this.stockId]);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to update Stock data.`,
        });
        return;
      }
    })
  }

}

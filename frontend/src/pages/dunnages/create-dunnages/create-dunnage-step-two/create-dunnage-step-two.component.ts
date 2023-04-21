import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DunnageService } from 'src/services/dunnage.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-create-dunnage-step-two',
  templateUrl: './create-dunnage-step-two.component.html',
  styleUrls: ['./create-dunnage-step-two.component.scss']
})
export class CreateDunnageStepTwoComponent {
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
    private dunnageService: DunnageService,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private authService: AuthService
  ) {
    this.sharedService.setDataKey('dunnage');
    this.request = this.sharedService.getData();
  }

  async ngOnInit() {
    this.spinnerService.showHide();
  }

  ngAfterViewInit() {
    this.sharedService.setDataKey('dunnage');
    this.request = this.sharedService.getData();
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

    const dunnage = {
      departmentId: this.request.dunnage.selectedDepartment._id,
      name: this.request.dunnage.name,
      skidQuantity: this.request.dunnage.skidQuantity,
      lowStock: this.request.dunnage.lowStock,
      moderateStock: this.request.dunnage.moderateStock,
      marketLocation: this.request.dunnage.marketLocation,
    }

    const formData: FormData = new FormData();

    formData.append('file', this.file);
    formData.append('dunnage', JSON.stringify(dunnage));

    this.dunnageService.createDunnage(formData).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Dunnage created successfully' });
        this.router.navigate(['/dashboard/dunnage/create/success']);
      },
      error: (error) => {
        this.spinnerService.hide();
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

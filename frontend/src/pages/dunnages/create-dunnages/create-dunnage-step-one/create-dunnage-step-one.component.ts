import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DunnageService } from 'src/services/dunnage.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';

@Component({
  selector: 'app-create-dunnage-step-one',
  templateUrl: './create-dunnage-step-one.component.html',
  styleUrls: ['./create-dunnage-step-one.component.scss']
})
export class CreateDunnageStepOneComponent {
  public displayValidationErrors: boolean = false;
  dunnageForm: FormGroup;
  request: any;
  activePlantId: any;
  departments: any[] = [];
  selectedDepartment: any;

  constructor(
    private dunnageService: DunnageService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private messageService: MessageService) {
        this.dunnageForm = this.formBuilder.group({
          name: new FormControl(''),
          skidQuantity: new FormControl(''),
          lowStock: new FormControl(''),
          marketLocation: new FormControl(''),
          department: new FormControl('', [Validators.required]),
        });
        this.sharedService.setDataKey('dunnage');
        if (this.sharedService.getData() != null) {
          this.request = this.sharedService.getData();
          this.dunnageForm.patchValue(
          this.request.dunnage
          );
        }
    }

    ngAfterViewInit() {

    }

    async ngOnInit() {
      this.spinnerService.showHide();
      this.activePlantId = this.authService.user.activePlantId;
      await this.loadDepartments();

      if (this.request != null) {
        this.selectedDepartment = this.request.dunnage.selectedDepartment;
      }
    }

    async loadDepartments() {
      let departmentQuery = "?plantId=" + this.activePlantId;
      console.log("DEPARTMENT QUERY => " + departmentQuery);

      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          console.log(data);
          this.departments = data.body.departments;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }

    onSubmit() {
      if(!this.dunnageForm.valid) {
        this.displayValidationErrors = true;
        this.spinnerService.hide();
        return;
      }

      this.spinnerService.show();

      //TODO Check Math
      let moderateStock = this.dunnageForm.value.lowStock * 2;

      const dunnage = {
        name: this.dunnageForm.value.name,
        skidQuantity: this.dunnageForm.value.skidQuantity,
        lowStock: this.dunnageForm.value.lowStock,
        moderateStock: moderateStock,
        marketLocation: this.dunnageForm.value.marketLocation,
        selectedDepartment: this.selectedDepartment
      }

      this.request.dunnage = dunnage;
      this.sharedService.setData(this.request);

      let query = "?name=" + dunnage.name;

      this.dunnageService.getDunnages(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          console.log("DATA => " + data);
          if (data.body.dunnages && data.body.dunnages.length > 0) {
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'Error', detail:'Dunnage already exists.'});
            return
          }
          this.router.navigate(['/dashboard/dunnage/create/step-two']);
        },
        error: (error: any) => {
          this.spinnerService.hide();
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          return;
        }
      });

    }


}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DunnageService } from 'src/services/dunnage.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { Location } from '@angular/common';
import { Department } from 'src/models/department';

@Component({
  selector: 'app-edit-dunnage',
  templateUrl: './edit-dunnage.component.html',
  styleUrls: ['./edit-dunnage.component.scss']
})
export class EditDunnageComponent {
  public displayValidationErrors: boolean = false;
  dunnageForm: FormGroup;
  activePlantId: string = '';
  departments: Department[] = [];
  selectedDepartment: Department = {} as Department;
  dunnageId: string = '';
  departmentId: string = '';

  constructor(
    private dunnageService: DunnageService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private messageService: MessageService,
    private location: Location
    ) {
        this.dunnageForm = this.formBuilder.group({
          name: new FormControl(''),
          skidQuantity: new FormControl(''),
          lowStock: new FormControl(''),
          marketLocation: new FormControl(''),
          department: new FormControl('', [Validators.required]),
        });
    }

    async ngOnInit() {
      this.spinnerService.showHide();
      this.activePlantId = this.authService.user.activePlantId;
      await this.loadDepartments();
      this.route.params.subscribe(params => {
        this.dunnageId = params['id'];
        this.loadDunnageData();
      });
      console.log("DUNNAGE ID => " + this.dunnageId);
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

    loadDunnageData() {
      this.spinnerService.show();
      let query = "?dunnageId=" + this.dunnageId;

      this.dunnageService.getDunnages(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          console.log(data.body.dunnages[0]);
          if (data) {
            // populate the form controls with the department data
            this.dunnageForm.patchValue({
              name: data.body.dunnages[0].name,
              skidQuantity: data.body.dunnages[0].skidQuantity,
              lowStock: data.body.dunnages[0].lowStock,
              marketLocation: data.body.dunnages[0].marketLocation,
            });

            this.departmentId = data.body.dunnages[0].departmentId;
            console.log("DEPARTMENT ID => " + this.departmentId);

            for (let i = 0; i < this.departments.length; i++) {
              if (this.departments[i]._id === this.departmentId) {
                this.departments[i].position = i;
                this.selectedDepartment = this.departments[i];
                console.log("SELECTED DEPARTMENT => " + this.selectedDepartment);
                break;
              }
            }

          }
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
      });

    }

    updateImage() {
      this.router.navigate(['/dashboard/dunnage/edit/image/', this.dunnageId]);
    }

    onSubmit() {
      if (!this.dunnageForm.valid) {
        this.displayValidationErrors = true;
        this.spinnerService.hide();
        return;
      }

      this.spinnerService.show();

      let moderateStock = this.dunnageForm.value.lowStock * 2;

      const dunnage = {
        name: this.dunnageForm.value.name,
        skidQuantity: this.dunnageForm.value.skidQuantity,
        lowStock: this.dunnageForm.value.lowStock,
        moderateStock: moderateStock,
        marketLocation: this.dunnageForm.value.marketLocation,
        departmentId: this.selectedDepartment._id,
        dunnageId: this.dunnageId
      }

      this.sharedService.setData(dunnage);

      this.dunnageService.editDunnage(dunnage)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          console.log(data);
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: `Success: `,
            detail: `Dunnage data updated successfully.`,
          });

          this.router.navigate(['/dashboard/dunnage/list']);
        },
        error: (error: any) => {
          this.spinnerService.hide();
          console.log(error);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: `Error: `,
            detail: `Failed to update Dunnage data.`,
          });
          return;
        }
      });


    }

}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss'],
  providers: [DepartmentService, ConfirmationService]
})
export class EditDepartmentComponent {
  public displayValidationErrors: boolean = false;
  departmentForm: FormGroup;
  departmentId: string = ''; // add a variable to hold the department id
  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute, // add ActivatedRoute to the constructor
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

    this.departmentForm = this.formBuilder.group({
      departmentName: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['id']; // get the department id from the route params
      this.loadDepartmentData(); // call a method to load the department data
    });
  }

  loadDepartmentData() {
    this.spinnerService.show();
    let query = "?departmentId=" + this.departmentId;
    this.departmentService.getDepartments(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        if (data) {
          // populate the form controls with the department data
          this.departmentForm.patchValue({
            departmentName: data.body.departmentName,
            departmentLocation: data.body.departmentLocation
          });
        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to get department data.`,
        });
        return;
      }
    });
  }

  deleteDepartment(departmentId: any) {
    this.confirmationService.confirm({

      message: 'Are you sure that you want to delete this department?',
      accept: () => {
        this.spinnerService.show();

        this.departmentService.deleteDepartment(departmentId)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: `Success: `,
              detail: `Plant deleted successfully.`,
            });

            this.router.navigate(['/dashboard/departments/list']);
          },
          error: (error: any) => {
            this.spinnerService.hide();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: `Error: `,
              detail: `Failed to delete department.`,
            });
            return;
          }
        });
      },
      reject: () => {
        //reject action
      }
    });
  }

  onSubmit() {
    if (!this.departmentForm.valid) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }
    this.spinnerService.show();
    const department = {
      departmentName: this.departmentForm.value.departmentName,
      departmentId: this.departmentId
    }

    this.sharedService.setData(department);



    this.departmentService.editDepartment(department).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Plant data updated successfully.`,
        });

        this.router.navigate(['/dashboard/departments/list']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to update department data.`,
        });
        return;

      }
    });
  }
}

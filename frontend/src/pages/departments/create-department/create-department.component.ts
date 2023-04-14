import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent {
  public displayValidationErrors: boolean = false;
  departmentForm: FormGroup;
  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,
    private authService: AuthService,

    private messageService: MessageService) {
    this.departmentForm = this.formBuilder.group({
      departmentName: new FormControl(''),
    });
  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {

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
      plantId: this.authService.user.activePlantId,
    }



    let query = "?departmentName=" + department.departmentName + "&plantId=" + department.plantId;

    this.departmentService.getDepartments(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        if (data.body) {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: `Error: `,
            detail: `Department name already exists.`,
          });
          return;

        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Department name already exists.`,
        });
        return;

      }
    });


    this.departmentService.createDepartment(department).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Department created successfully.`,
        });
        this.router.navigate(['/dashboard/departments/list']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Error when creating department. ${error}`,
        });
        return;

      }
    });



  }
}

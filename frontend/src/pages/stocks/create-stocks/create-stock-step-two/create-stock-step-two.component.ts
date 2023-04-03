import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';
import { Department } from 'src/models/department';

@Component({
  selector: 'app-create-stock-step-two',
  templateUrl: './create-stock-step-two.component.html',
  styleUrls: ['./create-stock-step-two.component.scss']
})
export class CreateStockStepTwoComponent {

  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  request: any;
  activePlantId: string = '';
  departments: Department[] = [];
  selectedDepartment: Department = {} as Department;

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
    this.stockForm = this.formBuilder.group({
      marketLocation: new FormControl(''),
      department: new FormControl('', [Validators.required]),
    });
    this.sharedService.setDataKey('stock');
    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();
      console.log("REQUEST => " + JSON.stringify(this.request));
      this.stockForm.patchValue(
        this.request.stock
      );
      if (this.request.stock.selectedDepartment != null) {
        this.selectedDepartment = this.request.stock.selectedDepartment;
      }
    }

  }

  async ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;
    await this.loadDepartments();
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
    this.spinnerService.show();
    if (!this.stockForm.valid) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }
    this.spinnerService.showHide();



    let departmentQuery = "?plantId=" + this.activePlantId + "&departmentName=" + this.stockForm.value.department;




    this.request.stock.marketLocation = this.stockForm.value.marketLocation;
    this.request.stock.selectedDepartment = this.selectedDepartment;

    this.sharedService.setData(this.request).then(() => {
      this.spinnerService.hide();
      this.router.navigate(['/dashboard/stock/create/step-three']);
    });

    console.log(this.request);


  }
  changeDepartment($event: any) {
    console.log(this.selectedDepartment);

    this.request.stock.selectedDepartment = this.selectedDepartment;
    this.sharedService.setData(this.request);
    console.log(this.request);


  }

}






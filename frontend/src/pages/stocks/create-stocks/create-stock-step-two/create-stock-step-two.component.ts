import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DepartmentService } from 'src/services/department.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-create-stock-step-two',
  templateUrl: './create-stock-step-two.component.html',
  styleUrls: ['./create-stock-step-two.component.scss']
})
export class CreateStockStepTwoComponent {

  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  request: any;
  activePlantId: any;
  departmentNames: any[] = [];

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
      this.request = this.sharedService.getData();
      console.log(this.request);

      this.stockForm = this.formBuilder.group({
        marketLocation: new FormControl(''),
        department: new FormControl(''),
      });

      if (this.sharedService.getData() != null) {
        this.request = this.sharedService.getData();
        this.stockForm.patchValue(
        this.request.stock
        );
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

      try {
        const data = await this.departmentService.getDepartments(departmentQuery).toPromise();
        data.body.departments.forEach((department: any) => {
          this.departmentNames.push(department.departmentName);
        });

        console.log("DEPARTMENT NAMES => " + this.departmentNames);
      } catch (error) {
        console.log(error);
      }
    }



    onSubmit() {

      if (!this.stockForm.valid) {
        this.displayValidationErrors = true;
        this.spinnerService.hide();
        return;
      }

      this.spinnerService.show();

      let departmentQuery = "?plantId=" + this.activePlantId + "&departmentName=" + this.stockForm.value.department;

      this.departmentService.getDepartments(departmentQuery).subscribe((data: any) => {
        console.log(data);
        const stock = {
        name: this.request.stock.name,
        partNumber: this.request.stock.partNumber,
        stockQtyPerTote: this.request.stock.stockQtyPerTote || null,
        totesPerSkid: this.request.stock.totesPerSkid || null,
        totalStockPerSkid: this.request.stock.totalStockPerSkid,
        lowStock: this.request.stock.lowStock,
        moderateStock: this.request.stock.moderateStock,
        roughStock: this.request.stock.roughStock,
        subAssembly: this.request.stock.subAssembly,
        marketLocation: this.stockForm.value.marketLocation,
        departmentId: data.body.departments[0]._id
        };

        this.request.stock = stock;
        this.sharedService.setData(this.request);

        console.log(this.request);
        this.router.navigate(['/dashboard/stock/create/step-three']);

        }, (error) => {
        console.log(error);
        this.spinnerService.hide();
        });
    }


}

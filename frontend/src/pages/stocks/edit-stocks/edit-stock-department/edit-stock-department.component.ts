import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';

@Component({
  selector: 'app-edit-stock-department',
  templateUrl: './edit-stock-department.component.html',
  styleUrls: ['./edit-stock-department.component.scss']
})
export class EditStockDepartmentComponent {
  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  activePlantId: any;
  departments: any[] = [];
  selectedDepartment: any;
  stockId: string = '';
  departmentId: string = '';

  constructor(
    private stockService: StockService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private messageService: MessageService) {
        this.stockForm = this.formBuilder.group({
          marketLocation: new FormControl(''),
          department: new FormControl('', [Validators.required]),
        });
    }

    async ngOnInit() {
      this.spinnerService.showHide();
      this.activePlantId = this.authService.user.activePlantId;
      await this.loadDepartments();
      this.route.params.subscribe(params => {
        this.stockId = params['id'];
        this.loadStockData();
      });
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

    loadStockData() {
      this.spinnerService.show();

      let query = "?stockId=" + this.stockId;

      this.stockService.getStocks(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          if (data) {
            this.stockForm.patchValue({
              marketLocation: data.body.stocks[0].marketLocation,
            });

            this.departmentId = data.body.stocks[0].departmentId;

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
            detail: `Failed to get stock data.`,
          });
          return;
        }
      });

    }

    onSubmit() {

    }
}

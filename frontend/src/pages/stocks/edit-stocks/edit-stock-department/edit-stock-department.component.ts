import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { Department } from 'src/models/department';
import { Stock } from 'src/models/stock';

@Component({
  selector: 'app-edit-stock-department',
  templateUrl: './edit-stock-department.component.html',
  styleUrls: ['./edit-stock-department.component.scss']
})
export class EditStockDepartmentComponent {
  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  activePlantId: string = '';
  departments: Department[] = [];
  selectedDepartment: Department = {} as Department;
  stockId: string = '';
  departmentId: string = '';
  stock: Stock = {} as Stock;

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
      });
      await this.loadStockData();
    }

    async loadDepartments() {
      let departmentQuery = "?plantId=" + this.activePlantId;

      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
        },
        error: (err: any) => {
        }
      });

    }

    async loadStockData() {
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
            this.stock = data.body.stocks[0];

            for (let i = 0; i < this.departments.length; i++) {
              if (this.departments[i]._id === this.departmentId) {
                this.departments[i].position = i;
                this.selectedDepartment = this.departments[i];
                break;
              }
            }

          }
        },
        error: (error: any) => {
          this.spinnerService.hide();
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
      if (!this.stockForm.valid) {
        this.displayValidationErrors = true;
        this.spinnerService.hide();
        return;
      }

      this.spinnerService.show();

      const stock = {
        name: this.stock.name,
        partNumber: this.stock.partNumber,
        stockQtyPerTote: this.stock.stockQtyPerTote,
        totesPerSkid: this.stock.totesPerSkid,
        totalStockPerSkid: this.stock.totalStockPerSkid,
        lowStock: this.stock.lowStock,
        moderateStock: this.stock.moderateStock,
        roughStock: this.stock.roughStock,
        isSubAssembly: this.stock.isSubAssembly,
        marketLocation: this.stockForm.value.marketLocation,
        departmentId: this.departmentId,
        stockId: this.stockId,
      }

      this.stockService.editStock(stock)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: `Success: `,
            detail: `Dunnage data updated successfully.`,
          });

          this.router.navigate(['/dashboard/stock/edit/info/' + this.stockId]);
        },
        error: (error: any) => {
          this.spinnerService.hide();
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: `Error: `,
            detail: `Failed to update Stock data.`,
          });
          return;
        }
      });

    }
}

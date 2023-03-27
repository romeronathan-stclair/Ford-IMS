import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartmentForecast } from 'src/models/responses/Forecast';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { ForecastService } from 'src/services/forecast.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-forecast-list',
  templateUrl: './forecast-list.component.html',
  styleUrls: ['./forecast-list.component.scss']
})
export class ForecastListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  selectedDepartment: any = null;
  departmentForecast: DepartmentForecast[] = [];
  activePlantId: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  departments: any[] = [];
  displayedColumns: string[] = [
    "productName",
    "departmentName",
    "health",
    "stockItemsLow",
    "dunnageItemsLow",
    "viewForecast"
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private forecastService: ForecastService,
    private departmentService: DepartmentService) { }

  ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;
    this.loadForecasts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadForecasts();
  }
  async loadDepartments() {
    let userId = this.authService.user._id;
    let query = "?plantId=" + this.authService.user.activePlantId;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(query).subscribe({
        next: (data: any) => {
          this.departments = [{ departmentName: "All Departments" }, ...data.body.departments];
          resolve();
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }
  changeDepartment($event: any) {
    this.loadForecasts();
  }
  async loadForecasts(query: string = '') {
    this.spinnerService.show();

    if (!this.selectedDepartment) {
      query = `?page=${this.currentPage}&pageSize=${this.pageSize}&plantId=${this.authService.user.activePlantId}`;
    } else {
      query = `?page=${this.currentPage}&pageSize=${this.pageSize}&departmentId=${this.selectedDepartment._id}`;
    }

    console.log(query);

    return new Promise<void>((resolve, reject) => {
      this.forecastService.getForecast(query).subscribe({
        next: (data: any) => {
          this.dataSource = new MatTableDataSource(data.body.forecastedProducts);
          this.length = data.body.forecastedProductsCount;
          this.spinnerService.hide();
          resolve();
        },
        error: (error: any) => {
          this.spinnerService.hide();
          reject(error);
        }
      });
    });
  }

  getHealthLabel(forecast: any) {

    if (forecast.stockForecast.lowStockCount > 0 || forecast.dunnageForecast.lowStockCount > 0) {
      return "Needs Attention";
    } else if (forecast.moderateStockThreshold) {
      return "Moderate";
    } else {
      return "Good";
    }
  }
  getHealthClass(forecast: any) {
    if (forecast.stockForecast.lowStockCount > 0 || forecast.dunnageForecast.lowStockCount > 0) {
      return "low-health";
    } else if (forecast.moderateStockThreshold || forecast.moderateDunnageThreshold) {
      return "moderate-health";
    } else {
      return "high-health";
    }
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';


@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  stockForm: FormGroup;
  selectedDepartment: any;
  departments: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  stocks: any[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private stockService: StockService,
    private spinnerService: SpinnerService,
    private authService: AuthService) {
    this.stockForm = new FormGroup({
      departmentName: new FormControl(''),
      stockName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    if (this.activePlantId != 0) {
      this.loadData();
    }
  }

  async loadData() {
    this.spinnerService.show();
    await this.loadDepartments();
    await this.loadStocks();
    this.spinnerService.hide();
  }

  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.activePlantId + "&userId=" + this.authService.user._id;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
          resolve();
        },
        error: (error: any) => {
          reject(error);

        }
      });
    });
  }

  async loadStocks(query: string = '') {
    const selectedDepartmentId = this.selectedDepartment ? this.selectedDepartment._id : this.departments[0]._id;
    let stockQuery = `?departmentId=${selectedDepartmentId}&page=${this.currentPage}&pageSize=${this.pageSize}`;

    if (query) {
      stockQuery += query;
    }
    console.log(stockQuery);

    return new Promise<void>((resolve, reject) => {
      this.stockService.getStocks(stockQuery)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            this.stocks = data.body.stocks;
            this.length = data.body.stockCount;
            this.dataSource = new MatTableDataSource(this.stocks);
            resolve();
          },
          error: (error: any) => {
            this.spinnerService.hide();
            reject();
          }
        });
    });
  }

  searchByName() {
    const nameControl = this.stockForm.get('stockName');

    if (nameControl) {
      const name = nameControl.value;

      let query = `&name=${name}`
      console.log(query);
      this.loadStocks(query);
    }
  }

  changeDepartment($event: any) {
    this.loadData();
  }



  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }





}

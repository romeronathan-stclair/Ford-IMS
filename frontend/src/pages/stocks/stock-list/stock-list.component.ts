import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Department } from 'src/models/department';
import { Stock } from 'src/models/stock';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';


@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  providers: [StockService, ConfirmationService]
})
export class StockListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';
  stockForm: FormGroup;
  selectedDepartment: Department = {} as Department;
  departments: Department[] = [];
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource();
  stocks: Stock[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private stockService: StockService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router) {
    this.stockForm = new FormGroup({

      departmentName: new FormControl(''),
      stockName: new FormControl(''),
    });
  }

  async ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    await this.loadData();
  }

  ngAfterViewInit() {
  }

  async loadData() {
    this.spinnerService.show();
    await this.loadDepartments();
    await this.loadStocks();
    this.spinnerService.hide();
  }

  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.activePlantId;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
          resolve();
          this.departments.unshift({ _id: '', departmentName: 'All Departments', plantId: '', isDeleted: false });



          let stockQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}`;

          console.log(stockQuery);

          this.stockService.getStocks(stockQuery)
            .subscribe({
              next: (data: any) => {
                console.log(data);
                this.spinnerService.hide();
                this.stocks = data.body.stocks;
                this.length = data.body.stockCount;
                console.log(this.stocks);
                this.dataSource = new MatTableDataSource(this.stocks);

              },
              error: (error: any) => {
                this.spinnerService.hide();
              }
            });
        },
        error: (error: any) => {
          reject(error);

        }
      });
    });
  }

  async loadStocks(query: string = '') {
    console.log(this.selectedDepartment);
    const selectedDepartmentId = this.selectedDepartment._id;
    let stockQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}`;

    if (query) {
      stockQuery += query;
    }
    if (selectedDepartmentId) {
      stockQuery += `&departmentId=${selectedDepartmentId}`;
    } else {
      stockQuery += `&userId=${this.authService.user._id}`;
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
      this.currentPage = 0;
      this.loadStocks(query);
    }
    // const nameControl = this.stockForm.get('stockName');

    // if (nameControl) {
    //   const name = nameControl.value;
    //   console.log(name);
    //   let query = "?page=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + name + "&departmentId=" + this.selectedDepartment._id;
    //   console.log(query);
    //   this.stockService.getStocks(query)
    //   .subscribe({
    //     next: (data) => {
    //       this.length = data.body.stockCount;
    //       this.stocks = data.body.stock;
    //       this.dataSource = new MatTableDataSource(this.stocks);
    //     }
    //   })
    // }
  }

  changeDepartment($event: any) {
    this.loadData();
  }



  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  deleteStock(stockId: any) {
    this.messageService.clear();
    this.confirmationService.confirm({

      message: 'Are you sure that you want to delete this stock?',
      accept: () => {
        this.spinnerService.show();

        this.stockService.deleteStock(stockId)
          .subscribe({
            next: (data: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Stock deleted successfully'
              });
              this.loadData();
            },
            error: (error: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete stock'
              });
            }
          });
      },
      reject: () => {
        //reject action
      }
    });
  }


  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/stock']);
  }


}

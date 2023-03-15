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
    });
  }

  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    this.loadData();
  }

  ngAfterViewInit() {

  }

  loadData() {
    this.spinnerService.show();

    let departmentQuery = "?plantId=" + this.activePlantId;

    let departmentIds: string[] = [];
    this.departmentService.getDepartments(departmentQuery)
      .subscribe({
        next: (data: any) => {
          data.body.departments.forEach((department: any) => {
            departmentIds.push(department._id);
          });
          this.departments = data.body.departments;

          console.log(departmentIds);

          let stockQuery = "?departmentId=" + departmentIds[1] + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

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
          console.log(error);
        }
      });

      console.log(this.stocks);
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  searchByName() {
    const nameControl = this.stockForm.get('stockName');

    if (nameControl) {
      const name = nameControl.value;

      let query = "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

      this.stockService.getStocks(query)
      .subscribe({
        next: (data) => {
          this.length = data.body.stockCount;
          this.stocks = data.body.stock;
          this.dataSource = new MatTableDataSource(this.stocks);
        }
      })
    }
  }

  changeDepartment($event: any) {
    console.log(this.selectedDepartment);

    this.spinnerService.show();

    if (this.selectedDepartment.departmentName == "All Departments") {
      this.loadData();
    }
    else {
      let stockQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}&departmentId=${this.selectedDepartment._id}&plantId=${this.authService.user.activePlantId}`;
      console.log(stockQuery);
      this.stockService.getStocks(stockQuery).subscribe({
        next: (data: any) => {
          console.log(data);
          this.spinnerService.hide();
          this.stocks = data.body.stocks;
          this.length = data.body.stockCount;
          this.dataSource = new MatTableDataSource(this.stocks);
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
    }
  }





}

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
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
  pageSize = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  stockForm: FormGroup;
  dataSource: any[] = [];
  stocks: any[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stockService: StockService,
    private spinnerService: SpinnerService, private authService: AuthService) {
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

    let query = "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    this.stockService.getStocks(query)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.stocks = data.body.stock;
        this.length = data.body.stockCount;
        this.dataSource = this.stocks;
      },
      error: (error: any) => {
        this.spinnerService.hide();
      }
    });


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
          this.dataSource = this.stocks;
        }
      })
    }
  }



}

import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StockService } from 'src/services/stock.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.scss']
})
export class ViewStockComponent {
  stockId: string = '';
  stock: any;
  departmentId: string = '';
  departmentName: string = '';
  departments: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stockService: StockService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.stockId = params['id'];
      this.loadData();
    })
  }

  async loadData() {
    this.spinnerService.show();

    let stockQuery = "?stockId=" + this.stockId;

    this.stockService.getStocks(stockQuery)
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.spinnerService.hide();
        this.stock = data.body.stocks[0];
        this.departmentId = this.stock.departmentId;

        let departmentQuery = "?plantId=" + this.authService.user.activePlantId + "&departmentId=" + this.departmentId;

        this.departmentService.getDepartments(departmentQuery)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            console.log(data)
            this.departmentName = data.body.departmentName;
          },
          error: (error: any) => {
            this.spinnerService.hide();
          }
        });

      },
      error: (error: any) => {
        this.spinnerService.hide();
      }
    });


  }

}

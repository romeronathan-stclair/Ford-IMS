import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { ProductService } from 'src/services/product.service';
import { ProductStockService } from 'src/services/productStock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';

@Component({
  selector: 'app-reassign-stock',
  templateUrl: './reassign-stock.component.html',
  styleUrls: ['./reassign-stock.component.scss']
})
export class ReassignStockComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roughproductChecked = false;
  subAssemblyChecked = false;
  departments: any[] = [];
  selectedDepartment: any;
  activePlantId: any;
  stocks: any[] = [];
  productId: any;
  productStocks: any[] = [];
  product: any;
  targetStocks: any[] = [];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private messageService: MessageService,
    private stockService: StockService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private productStockService: ProductStockService) {




  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];

      this.loadProductData();
    });
  }
  loadProductData() {
    this.spinnerService.show();
    let query = "?productId=" + this.productId;
    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log(data);
        if (data.body.products && data.body.products.length > 0) {
          // populate the form controls with the product data
          this.product = data.body.products[0];
          this.loadProductStocks();



        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to get product data.`,
        });
        return;
      }
    });
  }
  loadStocks() {
    let stockQuery = `?departmentId=${this.product.departmentId}&plantId=${this.authService.user.activePlantId}`;
 
    this.stockService.getStocks(stockQuery).subscribe({
      next: (data: any) => {

        this.spinnerService.hide();
        this.stocks = data.body.stocks.filter((stock: any) => {
          return !this.productStocks.find((productStock: any) => productStock.stockId === stock._id);
        });

        this.targetStocks = data.body.stocks.filter((stock: any) => {
          return this.productStocks.find((productStock: any) => productStock.stockId === stock._id);
        });

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
      }
    });

  }
  loadProductStocks() {
    let stockQuery = `?productId=${this.productId}`;

    this.productStockService.getProductStock(stockQuery).subscribe({
      next: (data: any) => {

        this.productStocks = data.body.productStocks;
        this.loadStocks();

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
      }
    });

  }

  openDialog($event: any) {

    const stock = $event.items[0];

    const dialogRef = this.dialog.open(UsePerDialogComponent, {

      data: {
        title: 'Amount of stock used per product',
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.targetStocks.find((stock: any) => stock._id === $event.items[0]._id).usePerProduct = result;
      } else {
        this.targetStocks = this.targetStocks.filter((stock: any) => stock._id !== $event.items[0]._id);
        this.stocks.push($event.items[0]);
        return;
      }



    });
  }
  moveBack($event: any) {
    const stock = $event.items[0];

  }

  submit() {


    this.productService.reassignProductStock({
      stocks: this.targetStocks,
      productId: this.productId
    }).subscribe({
      next: (data: any) => {

        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Product stock reassigned successfully.`,
        });
        this.router.navigate(['/dashboard/products/list']);

      }
      ,
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to reassign product stock.`,
        });
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';
import { Department } from 'src/models/department';
import { Stock } from 'src/models/stock';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { ProductService } from 'src/services/product.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';

@Component({
  selector: 'app-create-product-step-three',
  templateUrl: './create-product-step-three.component.html',
  styleUrls: ['./create-product-step-three.component.scss']
})
export class CreateProductStepThreeComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roughproductChecked = false;
  subAssemblyChecked = false;
  departments: Department[] = [];
  selectedDepartment: Department = {} as Department;
  activePlantId: string = '';
  stocks: Stock[] = [];
  targetStocks: Stock[] = [];

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
    public dialog: MatDialog) {

    this.sharedService.setDataKey('product');
    if (this.sharedService.getData() != null) {
      this.request = this.sharedService.getData();
      this.selectedDepartment = this.request.product.department;

      if (!this.request.product.stocks) {
        this.request.product.stocks = [];
      }
    }


  }
  async ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;

    await this.loadStocks();
  }

  loadStocks() {
    let stockQuery = `?departmentId=${this.selectedDepartment._id}&plantId=${this.authService.user.activePlantId}`;
    this.stockService.getStocks(stockQuery).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        this.stocks = data.body.stocks;
        if (this.request.product.stocks && this.request.product.stocks.length > 0) {
          this.targetStocks = this.stocks.filter((stock: any) => {

            return this.request.product.stocks.findIndex((targetStock: any) => targetStock.stockId === stock._id) !== -1;
          }
          ).map((stock: any) => {

            const productStock = this.request.product.stocks.find((ps: any) => ps.stockId === stock._id);
      
            return {
              ...stock,
              usePerProduct: productStock?.usePerProduct
            }
          });


          this.stocks = this.stocks.filter((stock: any) => {
            return this.targetStocks.findIndex((targetStock: any) => targetStock._id === stock._id) === -1;
          }
          );
        }

      },
      error: (error: any) => {
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
        const productStock = {
          stockId: stock._id,
          usePerProduct: result
        }
        stock.usePerProduct = result;

        this.request.product.stocks.push(productStock);
        this.sharedService.setData(this.request);
      } else {
        this.targetStocks = this.targetStocks.filter((stock: any) => stock._id !== $event.items[0]._id);
        this.stocks.push($event.items[0]);
        return;
      }



    });
  }
  moveBack($event: any) {
    const stock = $event.items[0];


    this.request.product.stocks = this.request.product.stocks.filter((productStock: any) => productStock.stockId !== stock._id);
    this.sharedService.setData(this.request);


  }

  submit() {

    this.router.navigate(['/dashboard/products/create/step-four']);

  }
}

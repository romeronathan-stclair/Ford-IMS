import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-create-stock-step-one',
  templateUrl: './create-stock-step-one.component.html',
  styleUrls: ['./create-stock-step-one.component.scss']
})
export class CreateStockStepOneComponent {
  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  request: any;
  roughStockChecked = false;
  subAssemblyChecked = false;

  constructor(
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,

    private messageService: MessageService) {
        this.stockForm = this.formBuilder.group({
          name: new FormControl(''),
          partNumber: new FormControl(''),
          stockQtyPerTote: new FormControl('', [Validators.required]),
          totesPerSkid: new FormControl('', [Validators.required]),
          totalStockPerSkid: new FormControl(''),
          lowStock: new FormControl(''),
          roughStock: new FormControl(''),
          subAssembly: new FormControl(''),
        });
        this.sharedService.setDataKey('stock');
        if (this.sharedService.getData() != null) {
          this.request = this.sharedService.getData();
          this.stockForm.patchValue(
          this.request.stock
          );
        }
    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
      if (this.request.stock != null) {
        this.roughStockChecked = this.request.stock.roughStockChecked;
        this.subAssemblyChecked = this.request.stock.subAssemblyChecked;

        if (this.roughStockChecked) {
          this.stockForm.controls['totalStockPerSkid'].enable();
          this.stockForm.controls['totalStockPerSkid'].setValidators([Validators.required]);
          this.stockForm.controls['stockQtyPerTote'].disable();
          this.stockForm.controls['totesPerSkid'].disable();
          this.stockForm.controls['stockQtyPerTote'].setValidators(null);
          this.stockForm.controls['totesPerSkid'].setValidators(null);
          this.stockForm.controls['stockQtyPerTote'].setValue(null);
          this.stockForm.controls['totesPerSkid'].setValue(null);
        }
      }
    }

    onCheckboxChange(event: MatCheckboxChange, type: string) {
      if (type === 'roughStock') {
        if (event.checked) {
          this.roughStockChecked = true;
          this.subAssemblyChecked = false;
        } else {
          this.roughStockChecked = false;
        }
      } else if (type === 'subAssembly') {
        if (event.checked) {
          this.subAssemblyChecked = true;
          this.roughStockChecked = false;
        } else {
          this.subAssemblyChecked = false;
        }
      }

      if (this.roughStockChecked) {
        this.stockForm.controls['totalStockPerSkid'].enable();
        this.stockForm.controls['totalStockPerSkid'].setValidators([Validators.required]);
        this.stockForm.controls['stockQtyPerTote'].disable();
        this.stockForm.controls['totesPerSkid'].disable();
        this.stockForm.controls['stockQtyPerTote'].setValidators(null);
        this.stockForm.controls['totesPerSkid'].setValidators(null);
        this.stockForm.controls['stockQtyPerTote'].setValue(null);
        this.stockForm.controls['totesPerSkid'].setValue(null);
      } else {
        this.stockForm.controls['stockQtyPerTote'].enable();
        this.stockForm.controls['totesPerSkid'].enable();
        this.stockForm.controls['stockQtyPerTote'].setValidators([Validators.required]);
        this.stockForm.controls['totesPerSkid'].setValidators([Validators.required]);
        this.stockForm.controls['totalStockPerSkid'].disable();
        this.stockForm.controls['totalStockPerSkid'].setValidators(null);
        this.stockForm.controls['totalStockPerSkid'].setValue(null);
      }

    }

    onSubmit() {
      if (!this.stockForm.valid ) {
        this.displayValidationErrors = true;
        this.spinnerService.hide();
        return;
      }

      this.spinnerService.show();

      let totalStock = this.stockForm.value.stockQtyPerTote * this.stockForm.value.totesPerSkid;
      let moderateStock = 0;

      //TODO Check Math
      if (this.roughStockChecked === true) {
        moderateStock = Number(this.stockForm.value.lowStock) * 2;
      } else {
        moderateStock = Number(this.stockForm.value.lowStock) + 2;
      }

      const stock = {
        name: this.stockForm.value.name,
        partNumber: this.stockForm.value.partNumber,
        stockQtyPerTote: this.stockForm.value.stockQtyPerTote || null,
        totesPerSkid: this.stockForm.value.totesPerSkid || null,
        totalStockPerSkid: totalStock || this.stockForm.value.totalStockPerSkid ,
        lowStock: this.stockForm.value.lowStock,
        moderateStock: moderateStock,
        roughStock: this.roughStockChecked,
        subAssembly: this.subAssemblyChecked,
        roughStockChecked: this.roughStockChecked,
        subAssemblyChecked: this.subAssemblyChecked
      };

      this.request.stock = stock;
      this.sharedService.setData(this.request);

      let query = "?name=" + stock.name;

      this.stockService.getStocks(query).subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          console.log("DATA => " + data);
          if (data.body.stocks && data.body.stocks.length > 0) {
            this.messageService.clear();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Stock already exists' });
            return;
          }
          this.router.navigate(['/dashboard/stock/create/step-two']);
        },
        error: (error: any) => {
          this.spinnerService.hide();
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          return;
        }
      });

    }


}

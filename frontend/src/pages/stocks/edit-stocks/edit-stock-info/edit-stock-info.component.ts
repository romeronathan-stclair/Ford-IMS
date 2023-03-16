import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { StockService } from 'src/services/stock.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-stock-info',
  templateUrl: './edit-stock-info.component.html',
  styleUrls: ['./edit-stock-info.component.scss']
})
export class EditStockInfoComponent {
  public displayValidationErrors: boolean = false;
  stockForm: FormGroup;
  roughStockChecked = false;
  subAssemblyChecked = false;
  activePlantId: any;
  stockId: string = '';

  constructor(
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private authService: AuthService,
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
    }

    async ngOnInit() {
      this.spinnerService.showHide();
      this.activePlantId = this.authService.user.activePlantId;
      this.route.params.subscribe(params => {
        this.stockId = params['id'];
        this.loadStockData();
      });
    }

    loadStockData() {
      this.spinnerService.show();

      let query = "?stockId=" + this.stockId;

      this.stockService.getStocks(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          if (data) {
            this.stockForm.patchValue({
              name: data.body.stocks[0].name,
              partNumber: data.body.stocks[0].partNumber,
              stockQtyPerTote: data.body.stocks[0].stockQtyPerTote,
              totesPerSkid: data.body.stocks[0].totesPerSkid,
              totalStockPerSkid: data.body.stocks[0].totalStockPerSkid,
              lowStock: data.body.stocks[0].lowStock,
            });

            if (data.body.stocks[0].roughStock) {
              this.roughStockChecked = true;
              this.stockForm.controls['totalStockPerSkid'].enable();
              this.stockForm.controls['totalStockPerSkid'].setValidators([Validators.required]);
              this.stockForm.controls['stockQtyPerTote'].disable();
              this.stockForm.controls['totesPerSkid'].disable();
              this.stockForm.controls['stockQtyPerTote'].setValidators(null);
              this.stockForm.controls['totesPerSkid'].setValidators(null);
              this.stockForm.get('roughStock')?.setValue(true);
              this.stockForm.get('subAssembly')?.setValue(false);
            } else if (data.body.stocks[0].subAssembly) {
              this.stockForm.controls['stockQtyPerTote'].enable();
              this.stockForm.controls['totesPerSkid'].enable();
              this.stockForm.controls['stockQtyPerTote'].setValidators([Validators.required]);
              this.stockForm.controls['totesPerSkid'].setValidators([Validators.required]);
              this.stockForm.controls['totalStockPerSkid'].disable();
              this.stockForm.controls['totalStockPerSkid'].setValidators(null);
              this.stockForm.get('roughStock')?.setValue(false);
              this.stockForm.get('subAssembly')?.setValue(true);
            } else {
              this.stockForm.controls['stockQtyPerTote'].enable();
              this.stockForm.controls['totesPerSkid'].enable();
              this.stockForm.controls['stockQtyPerTote'].setValidators([Validators.required]);
              this.stockForm.controls['totesPerSkid'].setValidators([Validators.required]);
              this.stockForm.controls['totalStockPerSkid'].disable();
              this.stockForm.controls['totalStockPerSkid'].setValidators(null);
              this.stockForm.get('roughStock')?.setValue(false);
              this.stockForm.get('subAssembly')?.setValue(false);
            }
          }
        }
      });

    }

    updateImage() {
      this.router.navigate(['/dashboard/stock/edit/image/', this.stockId]);
    }

    updateDepartment() {
      this.router.navigate(['/dashboard/stock/edit/department-location/', this.stockId]);
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
      } else {
        this.stockForm.controls['stockQtyPerTote'].enable();
        this.stockForm.controls['totesPerSkid'].enable();
        this.stockForm.controls['stockQtyPerTote'].setValidators([Validators.required]);
        this.stockForm.controls['totesPerSkid'].setValidators([Validators.required]);
        this.stockForm.controls['totalStockPerSkid'].disable();
      }

    }

    onSubmit() {

    }

}

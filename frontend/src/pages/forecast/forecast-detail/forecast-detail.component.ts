import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductForecast } from 'src/models/responses/Forecast';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { ForecastService } from 'src/services/forecast.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { StockService } from 'src/services/stock.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { iif } from 'rxjs';
import { ProductService } from 'src/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';

@Component({
  selector: 'app-forecast-detail',
  templateUrl: './forecast-detail.component.html',
  styleUrls: ['./forecast-detail.component.scss']
})
export class ForecastDetailComponent {
  productId: any;
  data: any;
  plugin = ChartDataLabels;
  options: any;
  productForecast: ProductForecast = {} as ProductForecast;
  totalPossibleBuilds: number = 0;
  dailyLimitDifferenceText: string = "";
  shiftsStockStatusText: string = "";
  hourlyProductionStatusText: string = "";
  projectTimeBeforeShortageText: string = "";
  projectTimeBeforeShortage: number = 0;
  stockForecastExists: boolean = false;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private forecastService: ForecastService,
    private productService: ProductService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private sharedService: SharedService,
  ) {

  }


  async ngOnInit() {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadForecast();
    })
  }

  async loadForecast() {
    this.spinnerService.showHide();
    this.forecastService.getProductForecast(this.productId).subscribe({
      next: (response: any) => {
        this.spinnerService.showHide();
        this.productForecast = response.body;
        if (this.productForecast.stockForecast?.forecastedStockItems) {
          this.stockForecastExists = true;
        }



      },
      error: (error: any) => {
        this.spinnerService.showHide();
      },
      complete: () => {
        this.getTotalPossibleBuildsText();
        this.getShiftsStatusText();
        this.getHourlyProductionStatusText();
        this.getProjectTimeBeforeShortageText();
        this.setupChart();
      }

    });

  }

  getTotalPossibleBuildsText() {
    if (this.productForecast.dailyTarget && this.productForecast.stockForecast?.lowestStockItem) {
      let dailyLimitDifference = this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds - this.productForecast.dailyTarget;
      if (this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds > this.productForecast.dailyTarget) {
        this.dailyLimitDifferenceText = dailyLimitDifference + " OVER Daily Target";
      } else if (this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds < this.productForecast.dailyTarget) {
        this.dailyLimitDifferenceText = dailyLimitDifference + " UNDER Daily Target";
      } else {
        this.dailyLimitDifferenceText = dailyLimitDifference + " ON  Daily Target";
      }
    }
  }
  getHealthClassForBuilds() {
    if (this.productForecast.dailyTarget && this.productForecast.stockForecast?.lowestStockItem) {
      let dailyLimitDifference = this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds - this.productForecast.dailyTarget;
      let twoDayProduction = this.productForecast.dailyTarget * 2;
      if (this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds > twoDayProduction) {
        return "high-health";
      } else if (this.productForecast.stockForecast?.lowestStockItem?.totalPossibleBuilds < this.productForecast.dailyTarget) {
        return "low-health";
      } else {
        return "medium-health";
      }

    }
    return
  }
  getHealthClassForShifts() {
      const shiftsThreshold = 3;
      const greenThreshold = 5;
      if(this.productForecast.stockForecast?.lowestStockItem?.shiftsBeforeShortage) {
        if (this.productForecast.stockForecast?.lowestStockItem?.shiftsBeforeShortage < shiftsThreshold) {
          return "low-health";
        } else if (this.productForecast.stockForecast?.lowestStockItem?.shiftsBeforeShortage > greenThreshold) {
          return "high-health";
        }
        else {
          return "medium-health";
        }
      }

    return
  }
  getShiftsStatusText() {
    const shiftsThreshold = 3;
    const hoursPerShift = 8; // Adjust this value according to your shift duration

    if (this.productForecast.stockForecast?.lowestStockItem?.shiftsBeforeShortage) {
      const shiftsDifference = this.productForecast.stockForecast.lowestStockItem.shiftsBeforeShortage - shiftsThreshold;

      if (shiftsDifference > 0) {
        this.shiftsStockStatusText = `${shiftsDifference} shifts OVER the 3 shift threshold`;
      } else if (shiftsDifference < 0) {
        this.shiftsStockStatusText = `${-shiftsDifference} shifts UNDER the 3 shift threshold`;
      } else {
        this.shiftsStockStatusText = `ON the threshold of ${shiftsThreshold} shifts`;
      }
    }
  }

  getHourlyProductionStatusText() {
    if (
      this.productForecast.stockForecast?.lowestStockItem?.jobsPerHour &&
      this.productForecast.dailyTarget
    ) {
      const targetJobsPerHour = Math.round(this.productForecast.dailyTarget / 24);
      const actualJobsPerHour = Math.round(this.productForecast.stockForecast.lowestStockItem.totalPossibleBuilds / 24);
      const hourlyDifference = Math.round(actualJobsPerHour - targetJobsPerHour);

      if (hourlyDifference > 0) {
        this.hourlyProductionStatusText = `${hourlyDifference} jobs OVER the target per hour`;
      } else if (hourlyDifference < 0) {
        this.hourlyProductionStatusText = `${-hourlyDifference} jobs UNDER the target per hour`;
      } else {
        this.hourlyProductionStatusText = `ON the target of ${targetJobsPerHour} jobs per hour`;
      }
    }
  }
  getHealthClassForJobsPerHour() {
    if (
      this.productForecast.stockForecast?.lowestStockItem?.jobsPerHour &&
      this.productForecast.dailyTarget
    ) {
      const targetJobsPerHour = this.productForecast.dailyTarget / 24;
      const actualJobsPerHour = this.productForecast.stockForecast.lowestStockItem.totalPossibleBuilds / 24;
      const hourlyDifference = actualJobsPerHour - targetJobsPerHour;

      if (hourlyDifference > 0) {
        return "high-health";
      } else if (hourlyDifference < 0) {
        return "low-health";
      } else {
        return "medium-health";
      }
    }
    return "";
  }
  getProjectTimeBeforeShortageText() {
    if (

      this.productForecast.stockForecast?.lowestStockItem?.jobsPerHour &&
      this.productForecast.dailyTarget
    ) {


      this.projectTimeBeforeShortage = this.productForecast.stockForecast.lowestStockItem.hoursBeforeShortage || 0;
      this.projectTimeBeforeShortageText = "Based on production rate of " + this.productForecast.dailyTarget + " per day"




    }

  }
  getProjectTimeBeforeShortageClass() {
    if (this.projectTimeBeforeShortage > 48) {
      return "high-health";
    } else if (this.projectTimeBeforeShortage < 0) {
      return "low-health";
    } else {
      return "medium-health";
    }
  }

  setupChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    let stockForecast = this.productForecast.stockForecast;

    this.data = {
      labels: [`High Stock - ${stockForecast?.highStockCount}`, `Medium Stock - ${stockForecast?.moderateStockCount}`, `Low Stock - ${stockForecast?.lowStockCount}`],
      datasets: [
        {
          data: [stockForecast?.highStockCount, stockForecast?.moderateStockCount, stockForecast?.lowStockCount],
          backgroundColor: ["#67C587", "#FFD600", "#EC0000"],

        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: "black",

          },
          position: 'right',


        },
        datalabels: {
          formatter: (value: any, ctx: any) => {
            let label = ctx.chart.data.labels[ctx.dataIndex];
            return label + ": " + value;
          },
          color: "black ",
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },


    };


  }
  openDialog($event: any) {





    const dialogRef = this.dialog.open(UsePerDialogComponent, {

      data: {
        title: 'Set Daily Production Count',
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        const request = {
          productId: this.productForecast.productId,
          dailyTarget: result
        }

        this.productService.changeProductionCount(request).subscribe({
          next: (response: any) => {
            this.spinnerService.showHide();
            this.messageService.clear();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Production Count Changed' });
            this.sharedService.refreshDashboardForecast(true);
            this.loadForecast();

          },
          error: (error: any) => {
            this.spinnerService.showHide();
          },

        }
        );

      } else {


      }



    });
  }

}

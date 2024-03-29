import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { Router } from '@angular/router';
import { Plant } from 'src/models/plant';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  providers: [PlantService, ConfirmationService]
})
export class PlantListComponent {
  currentPage = 0;
  length = 0;
  pageSize = 5;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  plants: Plant[] = [];
  displayedColumns: string[] = [
    "name",

    "makeActive",
    "editInformation",
    "viewDepartments"
  ];
  dropDownOptions = [
    "All",
    "Opened",
    "Closed by user",
    "Closed by admin",
    "Assigned",
    "Resolved"
  ];
  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private plantService: PlantService,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    public roleService: RoleService) { }


  ngOnInit() {
    this.loadData();

  }

  ngAfterViewInit() {


    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    this.spinnerService.show();

    let userId = this.authService.user._id;

    let query = "?userId=" + userId + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    this.plantService
      .getUserPlants(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.plants = data.body.plants;
          this.length = data.body.plantCount;
          this.dataSource = new MatTableDataSource(this.plants);
          this.activePlantId = this.authService.user.activePlantId;
        },
        error: (error: any) => {
          this.spinnerService.hide();

        },
      });



  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  makePlantActive(plantId: any) {


    this.confirmationService.confirm({

      message: 'Are you sure that you want to make this plant active?',
      accept: () => {
        this.spinnerService.show();
        this.authService.makePlantActive(JSON.stringify({ plantId })).subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            this.activePlantId = plantId;
            this.sharedService.refreshDashboardForecast(true);
            this.messageService.clear();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant is now active' });
          },
          error: (error: any) => {
            this.spinnerService.hide();
            this.messageService.add({
              severity: 'error', summary: 'Error', detail: 'Something went wrong - please try again later'
            });

          },
        });



      },
      reject: () => {
        //reject action
      }
    });
  }

  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/plant']);
  }


}

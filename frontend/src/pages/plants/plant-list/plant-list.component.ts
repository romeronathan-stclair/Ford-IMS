import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SpinnerService } from 'src/services/spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  providers: [PlantService, ConfirmationService]
})
export class PlantListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 5;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  plants: any[] = [];
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
    private router: Router
    ) { }
  ngOnInit() {
    this.loadData();


  }

  ngAfterViewInit() {


    this.dataSource.paginator = this.paginator;
    console.log(this.paginator);
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
          console.log(this.plants);
        },
        error: (error: any) => {
          this.spinnerService.hide();

        },
      });



  }
  pageChanged(event: PageEvent) {
    console.log({ event });
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

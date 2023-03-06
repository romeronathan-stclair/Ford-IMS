import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  providers: [PlantService]
})
export class PlantListComponent {
  currentPage = 0;
  pageSize = 5;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
  constructor(private plantService: PlantService, private authService: AuthService) { }
  ngOnInit() {

    this.loadData();


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    console.log(this.paginator);
  }

  loadData() {
    let userId = this.authService.user._id;

    let query = "?userId=" + userId + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    console.log(userId);


    this.plantService
      .getUserPlants(query)
      .subscribe({
        next: (data: any) => {
          console.log('PlantListComponent: ngOnInit: data: ', data);
          this.plants = data.body;
          console.log(this.plants);
        },
        error: (error: any) => {
          console.log('PlantListComponent: ngOnInit: error: ', error);

        },
      });



  }
  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

}

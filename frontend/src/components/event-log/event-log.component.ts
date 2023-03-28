import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/services/event.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss']
})
export class EventLogComponent {
  currentPage = 0;
  length = 100;
  pageSize = 10;
  activePlantId: any;
  modelType = '';
  operationType = '';
  plant = '';
  department = '';
  date = '';
  plants: any[] = [];
  selectedPlant: any = '';
  departments: any[] = [];
  selectedDepartment: any = '';
  operations = [
      { operationName: 'Create'},
      { operationName: 'Update'},
      { operationName: 'Delete'}
    ];
  selectedOperation: any = '';
  selectedDate: any;
  events: any;

  constructor(
    private authService: AuthService,
    private plantService: PlantService,
    private departmentService: DepartmentService,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) { }

  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    this.route.params.subscribe(params => {
      this.modelType = params['modelType'];
      this.modelType = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1);
    });
    this.loadEvents();
    this.loadPlants();
    this.loadDepartments();
  }

  loadEvents() {
    this.spinnerService.show();

    let eventQuery = "?modelType=" + this.modelType;

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.events = data.body;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
  }

  loadPlants() {
    let plantQuery = "?userId=" + this.authService.user._id

    let plantIds: string[] = [];
    this.plantService.getPlants(plantQuery)
    .subscribe({
      next: (data: any) => {
        data.body.plants.forEach((plant: any) => {
          plantIds.push(plant._id);
        });
        this.plants = data.body.plants;
        this.plants.unshift({_id: '', plantName: 'All Plants' });
        console.log(this.plants);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadDepartments() {

    let departmentQuery = "?plantId=" + this.activePlantId;

    let departmentIds: string[] = [];
    this.departmentService.getDepartments(departmentQuery)
      .subscribe({
        next: (data: any) => {
          data.body.departments.forEach((department: any) => {
            departmentIds.push(department._id);
          });
          this.departments = data.body.departments;
          this.departments.unshift({_id: '', departmentName: 'All Departments' });
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  changePlant($event: any) {
    let eventQuery = '';

    if (this.selectedDepartment === '' && this.operationType === '') {
      console.log('1')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id
    } else if (this.selectedDepartment === '' && this.operationType !== '') {
      console.log('2')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation;
    } else if (this.selectedDepartment !== '' && this.operationType === '') {
      console.log('3')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id;
    } else {
      console.log('4')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.events = data.body;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });

  }

  changeDepartment($event: any) {
    let eventQuery = '';

    if (this.selectedPlant === '' && this.operationType === '') {
      console.log('1')
      eventQuery = "?modelType=" + this.modelType + "&departmentId=" + this.selectedDepartment._id
    } else if (this.selectedPlant === '' && this.operationType !== '') {
      console.log('2')
      eventQuery = "?modelType=" + this.modelType + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    } else if (this.selectedPlant !== '' && this.operationType === '') {
      console.log('3')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id;
    } else {
      console.log('4')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.events = data.body;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
  }

  changeOperation($event: any) {
    let eventQuery = '';

    if (this.selectedPlant === '' && this.selectedDepartment === '') {
      console.log('1')
      eventQuery = "?modelType=" + this.modelType + "&operationType=" + this.selectedOperation;
    } else if (this.selectedPlant === '' && this.selectedDepartment !== '') {
      console.log('2')
      eventQuery = "?modelType=" + this.modelType + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    } else if (this.selectedPlant !== '' && this.selectedDepartment === '') {
      console.log('3')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation;
    } else {
      console.log('4')
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.events = data.body;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  backPage() {
    this.location.back();
  }

}

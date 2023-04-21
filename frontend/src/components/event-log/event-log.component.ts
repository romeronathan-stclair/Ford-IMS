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
import { Event } from 'src/models/event';
import { Plant } from 'src/models/plant';
import { Department } from 'src/models/department';


@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss']
})
export class EventLogComponent {
  currentPage = 0;
  length = 0;
  pageSize = 10;
  activePlantId: string = '';
  modelType = '';
  operationType = '';
  plant = '';
  department = '';
  date = '';
  plants: Plant[] = [];
  selectedPlant: any = '';
  departments: Department[] = [];
  selectedDepartment: any = '';
  operations = [
    { operationName: 'All', operationValue: '' },
    { operationName: 'Create', operationValue: 'Create' },
    { operationName: 'Update', operationValue: 'Update' },
    { operationName: 'Delete', operationValue: 'Delete' }
  ];
  selectedOperation: any = '';
  events: Event[] = [];

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

    let eventQuery = "?modelType=" + this.modelType + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    if (this.modelType !== 'Plant') {
      eventQuery += "&plantId=" + this.activePlantId;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          this.events = data.body.events;
          this.events.reverse();
          this.length = data.body.eventCount;
          this.spinnerService.hide();
        },
        error: (error: any) => {
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
          this.plants.unshift({ _id: '', plantName: 'All Plants', plantId: '', departments: [] });
        },
        error: (error: any) => {
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
          this.departments.unshift({ _id: '', departmentName: 'All Departments', plantId: '', isDeleted: false });
        },
        error: (error: any) => {
        }
      });
  }

  changePlant($event: any) {
    let eventQuery = "?modelType=" + this.modelType + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    if (this.operationType === '') {
      eventQuery += "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation;
    } else if (this.operationType !== '') {
      eventQuery += "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          this.events = data.body.events;
          this.events.reverse();
          this.length = data.body.eventCount;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          this.spinnerService.hide();
        }
      });

  }

  changeDepartment($event: any) {
    let eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.activePlantId + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    if (this.selectedDepartment !== '' && this.selectedOperation === '') {
      eventQuery += "&plantId=" + this.activePlantId + "&departmentId=" + this.selectedDepartment._id;
    } else if (this.selectedDepartment === '' && this.selectedOperation !== '') {
      eventQuery += "&plantId=" + this.activePlantId + "&operationType=" + this.selectedOperation;
    } else if (this.selectedDepartment !== '' && this.selectedOperation !== '') {
      eventQuery += "&plantId=" + this.activePlantId + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          this.events = data.body.events;
          this.events.reverse();
          this.length = data.body.eventCount;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          this.spinnerService.hide();
        }
      });
  }

  changeOperation($event: any) {
    let eventQuery = "?modelType=" + this.modelType + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;

    if (this.modelType === 'Plant' && this.selectedPlant === '') {
      eventQuery += "&operationType=" + this.selectedOperation;
    } else if (this.modelType === 'Plant' && this.selectedPlant !== '') {
      eventQuery += "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation;
    } else if (this.modelType === 'Department' && this.selectedDepartment === '') {
      eventQuery += "&plantId=" + this.activePlantId + "&operationType=" + this.selectedOperation;
    } else if (this.modelType === 'Department' && this.selectedDepartment !== '') {
      eventQuery += "&plantId=" + this.activePlantId + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    } else {
      eventQuery += "&plantId=" + this.activePlantId + "departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          this.events = data.body.events;
          this.events.reverse();
          this.length = data.body.eventCount;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          this.spinnerService.hide();
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.spinnerService.show();
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    let eventQuery = '';

    if (this.selectedPlant === '' && this.selectedDepartment === '' && this.operationType === '') {
      eventQuery = "?modelType=" + this.modelType + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant === '' && this.selectedDepartment === '' && this.operationType !== '') {
      eventQuery = "?modelType=" + this.modelType + "&operationType=" + this.selectedOperation + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant === '' && this.selectedDepartment !== '' && this.operationType === '') {
      eventQuery = "?modelType=" + this.modelType + "&departmentId=" + this.selectedDepartment._id + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant === '' && this.selectedDepartment !== '' && this.operationType !== '') {
      eventQuery = "?modelType=" + this.modelType + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant !== '' && this.selectedDepartment === '' && this.operationType === '') {
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant !== '' && this.selectedDepartment === '' && this.operationType !== '') {
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&operationType=" + this.selectedOperation + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else if (this.selectedPlant !== '' && this.selectedDepartment !== '' && this.operationType === '') {
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    } else {
      eventQuery = "?modelType=" + this.modelType + "&plantId=" + this.selectedPlant._id + "&departmentId=" + this.selectedDepartment._id + "&operationType=" + this.selectedOperation + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
    }

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          this.events = data.body.events;
          this.events.reverse();
          this.length = data.body.eventCount;
          this.spinnerService.hide();
        }
      });

  }

  backPage() {
    this.location.back();
  }

  viewEventInfo($event: any) {
    this.router.navigate(['/dashboard/event/list/' + this.modelType + '/' + $event]);
  }

}

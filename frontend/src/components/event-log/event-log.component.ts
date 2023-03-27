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
  modelType = '';
  operationType = '';
  plant = '';
  department = '';
  date = '';
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
    this.route.params.subscribe(params => {
      this.modelType = params['modelType'];
      this.modelType = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1);
      this.loadEvents();
    });
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


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  backPage() {
    this.location.back();
  }

}

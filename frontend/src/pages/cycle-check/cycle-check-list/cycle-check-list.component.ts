import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { SpinnerService } from 'src/services/spinner.service';
import { EventService } from 'src/services/event.service';
import { Router } from '@angular/router';
import { Event } from 'src/models/event';
import { Department } from 'src/models/department';
import { RoleService } from 'src/services/role.service';
import { ExportService } from 'src/services/export.service';

@Component({
  selector: 'app-cycle-check-list',
  templateUrl: './cycle-check-list.component.html',
  styleUrls: ['./cycle-check-list.component.scss']
})
export class CycleCheckListComponent {
  currentPage = 0;
  length = 0;
  pageSize = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';
  departments: Department[] = [];
  events: Event[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private eventService: EventService,
    private router: Router,
    public roleService: RoleService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;
    this.loadEvents();
  }

  loadEvents() {
    this.spinnerService.show();

    let eventQuery = "?modelType=Cycle-check" + "&plantId=" + this.activePlantId + "&page=" + this.currentPage + "&limit=" + this.pageSize;

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
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadEvents();
  }

  viewEventInfo($event: any) {
    this.router.navigate(['/dashboard/event/list/Cycle-check' + '/' + $event]);
  }
  exportToCSV(event: any) {
    this.exportService.exportToCsv(event, event.modelType + '-' + event.itemId);
  }

}

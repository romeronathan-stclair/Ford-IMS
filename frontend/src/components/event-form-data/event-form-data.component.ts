import { Component } from '@angular/core';
import { Event } from 'src/models/event';
import { EventService } from 'src/services/event.service';
import { SpinnerService } from 'src/services/spinner.service'; import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/services/shared.service';
import { Location } from '@angular/common';
import { ExportService } from 'src/services/export.service';

@Component({
  selector: 'app-event-form-data',
  templateUrl: './event-form-data.component.html',
  styleUrls: ['./event-form-data.component.scss']
})
export class EventFormDataComponent {
  cycleCheckForm: any;
  subAssemblyForm: any;
  productionCountForm: any;
  itemName: string = '';
  modelType: string = '';
  itemId: string = '';
  date: string = '';
  time: string = '';
  event: Event = {} as Event;

  constructor(
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private location: Location,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modelType = params['modelType'];
      this.modelType = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1);
      this.itemId = params['itemId'];
      this.loadEvent();
    });
  }

  loadEvent() {
    this.spinnerService.showHide();

    let eventQuery = "?modelType=" + this.modelType + "&itemId=" + this.itemId;

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          if (this.modelType == 'Cycle-check') {
            this.cycleCheckForm = data.body.events[0].cycleCheckForm;
          } else if (this.modelType == 'Sub-assembly') {
            this.subAssemblyForm = data.body.events[0].subAssemblyForm;
          } else if (this.modelType == 'Production-count') {
            this.productionCountForm = data.body.events[0].productionCountForm;
            console.log(this.productionCountForm);
          }
          this.event = data.body.events[0];
          this.itemName = data.body.events[0].itemName;
          this.date = data.body.events[0].eventDate;
          this.time = data.body.events[0].eventTime;
        }
      });
  }

  goBack() {
    this.location.back();
  }
  exportToCSV(event: any) {
    this.exportService.exportToCsv(event, event.modelType + '-' + event.itemId);
  }

}

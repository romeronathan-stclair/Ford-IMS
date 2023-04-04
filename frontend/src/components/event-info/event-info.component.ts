import { Component } from '@angular/core';
import { SpinnerService } from 'src/services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlantService } from 'src/services/plant.service';
import { DepartmentService } from 'src/services/department.service';
import { EventService } from 'src/services/event.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent {
  modelType = '';
  itemId = '';
  event = {
    "plantName": "",
    "departmentName": [""],
    "_id": "",
    "plantId": "",
    "departmentId": "",
    "eventDate": "",
    "eventTime": "",
    "userId": "",
    "operationType": "",
    "modelType": "",
    "userName": "",
    "userEmailAddress": "",
    "itemId": "",
    "itemName": "",
    "createdAt": "",
    "updatedAt": "",
    "__v": 0
  }


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private plantService: PlantService,
    private departmentService: DepartmentService,
    private eventService: EventService,
    private location: Location,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.modelType = params['modelType'];
      this.modelType = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1);
      this.itemId = params['itemId'];
      this.loadEvent();
    });
  }

  async loadEvent()  {
    this.spinnerService.show();

    let eventQuery = "?modelType=" + this.modelType + "&itemId=" + this.itemId;

    console.log(eventQuery);

    this.eventService.getEvents(eventQuery)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.event = data.body.events[0];
          console.log(this.event);
          console.log(this.event.plantId);
          console.log(this.event.departmentId);

          let plantId = this.event.plantId;
          let departmentId = this.event.departmentId;

          if (plantId) {

            let plantQuery = "?plantId=" + plantId;

            this.plantService.getPlants(plantQuery)
              .subscribe({
                next: (data: any) => {
                  this.event.plantName = data.body.plantName;
                },
                error: (error: any) => {
                  console.log(error);
                }
              });
          }

          if (departmentId) {

            if (this.event.modelType !== 'Sub-assembly' && this.event.modelType !== 'Production-count') {
              let departmentQuery = "?departmentId=" + departmentId;

              this.departmentService.getDepartments(departmentQuery)
              .subscribe({
                next: (data: any) => {
                  this.event.departmentName = data.body.departmentName;
                  console.log(this.event.departmentName);
                }, error: (error: any) => {
                  console.log(error);
                }
              });
            } else {
              const parsedArray = JSON.parse(departmentId);
              console.log("PARSED ARRAY "+parsedArray);
              let departmentNames: string[] = [];

              for (let i = 0; i < parsedArray.length; i++) {
                let departmentQuery = "?departmentId=" + parsedArray[i];
                console.log(parsedArray[i]);
                console.log(departmentQuery);

                this.departmentService.getDepartments(departmentQuery)
                .subscribe({
                  next: (data: any) => {
                    departmentNames.push(data.body.departmentName);
                  }, error: (error: any) => {
                    console.log(error);
                  }
                });
              }

              this.event.departmentName = departmentNames;
            }
          }

          console.log(this.event);
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerService.hide();
        }
      });
  }

  backPage() {
    this.location.back();
  }

}

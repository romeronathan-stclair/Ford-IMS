import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DunnageService } from 'src/services/dunnage.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { Dunnage } from 'src/models/dunnage';
import { Department } from 'src/models/department';

@Component({
  selector: 'app-view-dunnage',
  templateUrl: './view-dunnage.component.html',
  styleUrls: ['./view-dunnage.component.scss']
})
export class ViewDunnageComponent {
  dunnageId: string = '';
  dunnage: Dunnage = {} as Dunnage;
  departmentId: string = '';
  departmentName: string = '';
  departments: Department[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dunnageService: DunnageService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.dunnageId = params['id'];
      this.loadData();
    })
  }

  async loadData() {
    this.spinnerService.show();

    let dunnageQuery = "?dunnageId=" + this.dunnageId;

    this.dunnageService.getDunnages(dunnageQuery)
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.spinnerService.hide();
        this.dunnage = data.body.dunnages[0];
        this.departmentId = this.dunnage.departmentId;

        let departmentQuery = "?plantId=" + this.authService.user.activePlantId + "&departmentId=" + this.departmentId;

        this.departmentService.getDepartments(departmentQuery)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            console.log(data)
            this.departmentName = data.body.departmentName;
          },
          error: (error: any) => {
            this.spinnerService.hide();
          }
        });

      },
      error: (error: any) => {
        this.spinnerService.hide();
      }
    });


  }

}

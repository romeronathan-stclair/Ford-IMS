import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { DunnageService } from 'src/services/dunnage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dunnage-list',
  templateUrl: './dunnage-list.component.html',
  styleUrls: ['./dunnage-list.component.scss']
})
export class DunnageListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  dunnageForm: FormGroup;
  selectedDepartment: any;
  departments: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dunnages: any[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private dunnageService: DunnageService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router) {
    this.dunnageForm = new FormGroup({
      dunnageName: new FormControl(''),
    });
  }

  async ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    await this.loadDepartments();
    await this.loadData();
  }

  ngAfterViewInit() {

  }

  async loadDepartments() {
    this.spinnerService.show();

    let departmentQuery = "?plantId=" + this.activePlantId;

    let departmentIds: string[] = [];
    this.departmentService.getDepartments(departmentQuery)
      .subscribe({
        next: (data: any) => {
          data.body.departments.forEach((department: any) => {
            departmentIds.push(department._id);
          });
          this.departments = data.body.departments;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          console.log(error);
        }
      });

  }

  async loadData() {
    this.spinnerService.show();

    let departmentQuery = "?plantId=" + this.activePlantId;

    let departmentIds: string[] = [];
    this.departmentService.getDepartments(departmentQuery)
      .subscribe({
        next: (data: any) => {
          data.body.departments.forEach((department: any) => {
            departmentIds.push(department._id);
          });
          this.departments = data.body.departments;
          this.length = data.body.departmentCount;
          console.log(departmentIds);

          let dunnageQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}`;

          if (this.selectedDepartment) {
            dunnageQuery += `&departmentId=${this.selectedDepartment._id}`;
          } else {
            dunnageQuery += `&departmentId=${departmentIds[0]}`;
          }

          this.dunnageService.getDunnages(dunnageQuery)
          .subscribe({
            next: (data: any) => {
              console.log(data);
              this.spinnerService.hide();
              this.dunnages = data.body.dunnages;
              this.length = data.body.dunnageCount;
              console.log(this.dunnages);
              this.dataSource = new MatTableDataSource(this.dunnages);
            },
            error: (error: any) => {
              this.spinnerService.hide();
            }
          });

        },
        error: (error: any) => {
          console.log(error);
        }
      });

      console.log(this.dunnages);
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  searchByName() {
    // const nameControl = this.dunnageForm.get('dunnageName');

    // if (nameControl) {
    //   const name = nameControl.value;

    //   let query = "?page=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + name;

    //   this.dunnageService.getDunnages(query)
    //   .subscribe({
    //     next: (data: any) => {
    //       this.length = data.body.dunnageCount;
    //       this.dunnages = data.body.dunnages;
    //       this.dataSource = new MatTableDataSource(this.dunnages);
    //     }
    //   });
    // }
  }

  changeDepartment($event: any) {
    console.log(this.selectedDepartment);

    this.spinnerService.show();

    if (this.selectedDepartment.departmentName == "All Departments") {
      this.loadData();
    }
    else {
      let dunnageQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}&departmentId=${this.selectedDepartment._id}&plantId=${this.authService.user.activePlantId}`;
      console.log(dunnageQuery);

      this.dunnageService.getDunnages(dunnageQuery)
      .subscribe({
        next: (data: any) => {
          console.log("DUNNAGE DATA => " + data);
          this.spinnerService.hide();
          this.dunnages = data.body.dunnages;
          this.length = data.body.dunnageCount;
          this.dataSource = new MatTableDataSource(this.dunnages);
          console.log(this.dunnages);
        },
        error: (error: any) => {
          this.spinnerService.hide();
        }
      });
    }
  }

  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/dunnage']);
  }

}

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
import { Dunnage } from 'src/models/dunnage';
import { Department } from 'src/models/department';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-dunnage-list',
  templateUrl: './dunnage-list.component.html',
  styleUrls: ['./dunnage-list.component.scss'],
  providers: [DunnageService, ConfirmationService]
})
export class DunnageListComponent {
  currentPage = 0;
  length = 0;
  pageSize = 6;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';
  dunnageForm: FormGroup;
  selectedDepartment: Department = {} as Department;
  departments: Department[] = [];
  dataSource: MatTableDataSource<Dunnage> = new MatTableDataSource();
  dunnages: Dunnage[] = [];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private dunnageService: DunnageService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router,
    public roleService: RoleService) {
    this.dunnageForm = new FormGroup({

      departmentName: new FormControl(''),
      dunnageName: new FormControl(''),
    });
  }

  async ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    if (this.activePlantId != "0") {
      await this.loadData();
    }
  }

  ngAfterViewInit() {
  }

  async loadData() {
    this.spinnerService.show();
    await this.loadDepartments();
    await this.loaddunnages();
    this.spinnerService.hide();
  }

  async loadDepartments() {
    let departmentQuery = "?plantId=" + this.activePlantId + "&userId=" + this.authService.user._id;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments = data.body.departments;
          this.departments.unshift({ _id: '', departmentName: 'All Departments', plantId: '', isDeleted: false });
          resolve();
        },
        error: (error: any) => {
          reject(error);

        }
      });
    });
  }
  async loaddunnages(query: string = '') {
    console.log(this.selectedDepartment);
    const selectedDepartmentId = this.selectedDepartment._id;
    let dunnageQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}`;

    if (query) {
      dunnageQuery += query;
    }
    if (selectedDepartmentId) {
      dunnageQuery += `&departmentId=${selectedDepartmentId}`;
    } else {
      dunnageQuery += `&userId=${this.authService.user._id}`;
    }
    console.log(dunnageQuery);

    return new Promise<void>((resolve, reject) => {
      this.dunnageService.getDunnages(dunnageQuery)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            this.dunnages = data.body.dunnages;
            this.length = data.body.dunnageCount;
            this.dataSource = new MatTableDataSource(this.dunnages);
            resolve();
          },
          error: (error: any) => {
            this.spinnerService.hide();
            reject();
          }
        });
    });
  }

  searchByName() {
    const nameControl = this.dunnageForm.get('dunnageName');

    if (nameControl) {
      const name = nameControl.value;

      let query = `&name=${name}`
      console.log(query);
      this.currentPage = 0;
      this.loaddunnages(query);
    }
    // const nameControl = this.dunnageForm.get('dunnageName');

    // if (nameControl) {
    //   const name = nameControl.value;
    //   console.log(name);
    //   let query = "?page=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + name + "&departmentId=" + this.selectedDepartment._id;
    //   console.log(query);
    //   this.dunnageService.getdunnages(query)
    //   .subscribe({
    //     next: (data) => {
    //       this.length = data.body.dunnageCount;
    //       this.dunnages = data.body.dunnage;
    //       this.dataSource = new MatTableDataSource(this.dunnages);
    //     }
    //   })
    // }
  }

  changeDepartment($event: any) {
    this.loadData();
  }



  pageChanged(event: PageEvent) {
    if (this.activePlantId == '0') {
      return;
    }
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  deleteDunnage(dunnageId: any) {
    this.messageService.clear();
    this.confirmationService.confirm({

      message: 'Are you sure that you want to delete this dunnage?',
      accept: () => {
        this.spinnerService.show();

        this.dunnageService.deleteDunnage(dunnageId)
          .subscribe({
            next: (data: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'dunnage deleted successfully'
              });
              this.loadData();
            },
            error: (error: any) => {
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete dunnage'
              });
            }
          });
      },
      reject: () => {
        //reject action
      }
    });
  }


  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/dunnage']);
  }


}

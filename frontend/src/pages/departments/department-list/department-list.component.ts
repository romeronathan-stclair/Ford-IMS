import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Department } from 'src/models/department';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { RoleService } from 'src/services/role.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent {
  currentPage = 0;
  length = 0;
  pageSize = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: string = '';
  departmentForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  departments: Department[] = [];
  displayedColumns: string[] = [
    "name",


    "editInformation",
    "viewProducts"
  ];
  dropDownOptions = [
    "All",
    "Opened",
    "Closed by user",
    "Closed by admin",
    "Assigned",
    "Resolved"
  ];
  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    public roleService: RoleService,
    private router: Router) {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl(''),
    });

  }
  ngOnInit() {
    this.activePlantId = this.authService.user.activePlantId;
    this.loadData();
  }

  ngAfterViewInit() {


    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    this.spinnerService.show();

    let userId = this.authService.user._id;

    let query = "?plantId=" + this.authService.user.activePlantId + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;


    this.departmentService.getDepartments(query)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.departments = data.body.departments;
          this.length = data.body.departmentCount;
          this.dataSource = new MatTableDataSource(this.departments);
        },
        error: (error: any) => {
          this.spinnerService.hide();

        },
      });



  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  searchByName() {
    const nameControl = this.departmentForm.get('departmentName');
    if (nameControl) {
      const name = nameControl.value;

      let query = "?plantId=" + this.authService.user.activePlantId + "&departmentName=" + name + "&page=" + this.currentPage + "&pageSize=" + this.pageSize;
      this.departmentService.getDepartments(query).subscribe({
        next: (data) => {
          this.length = data.body.departmentCount;
          this.departments = data.body.departments;
          this.dataSource = new MatTableDataSource(this.departments);
        }
      });
    }
  }

  viewEventLog() {
    this.router.navigate(['/dashboard/event/list/department']);
  }

}

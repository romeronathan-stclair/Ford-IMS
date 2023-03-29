import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 5;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  selectedDepartment: any;
  userForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  departments: any[] = [];
  users: any[] = [];
  displayedColumns: string[] = [
    "name",
    "departments",
    "viewUser",
    "editUser"
  ];

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private plantService: PlantService,
    private authService: AuthService,
    private departmentService: DepartmentService) {
    this.userForm = new FormGroup({
      name: new FormControl(''),
    });

  }
  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadData() {
    this.spinnerService.show();
    await this.loadDepartments();
    await this.loadUsers();
    this.spinnerService.hide();
  }

  async loadDepartments() {
    let userId = this.authService.user._id;
    let query = "?plantId=" + this.authService.user.activePlantId;

    return new Promise<void>((resolve, reject) => {
      this.departmentService.getDepartments(query).subscribe({
        next: (data: any) => {
          this.departments = [{_id: '', departmentName: "All Departments" }, ...data.body.departments];
          resolve();
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  async loadUsers(query: string = '') {
    const selectedDepartmentId = this.selectedDepartment ? this.selectedDepartment._id : '';
    let userQuery = `?page=${this.currentPage}&pageSize=${this.pageSize}&plantId=${this.authService.user.activePlantId}&departmentId=${selectedDepartmentId}`;
    if (query) {
      userQuery += query;
    }

    return new Promise<void>((resolve, reject) => {
      this.authService.getUsers(userQuery).subscribe({
        next: (data: any) => {
          this.users = data.body.users;
          this.length = data.body.userCount;
          this.dataSource = new MatTableDataSource(this.users);
          resolve();
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  changeDepartment($event: any) {
    this.loadUsers();
  }
  searchByName() {
    const nameControl = this.userForm.get('name');
    let query = '';

    if (nameControl?.value != "") {
      query += `&name=${nameControl?.value}`;
    }
    if (this.selectedDepartment && this.selectedDepartment.departmentName != "All Departments") {
      query += `&departmentId=${this.selectedDepartment._id}`;
    }

    this.loadUsers(query);
  }
  multipleDepartments(user: any) {
    let plant = user.plants.find((plant: any) => plant.plantId == this.authService.user.activePlantId);
    if (plant) {
      if (plant.departments.length == 1) {
        return this.departments.find((department: any) => department._id == plant.departments[0]).departmentName;
      }
      else {
        return "Multiple Departments"
      }
    }
  }
}


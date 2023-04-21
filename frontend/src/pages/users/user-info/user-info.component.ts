import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { DepartmentService } from 'src/services/department.service';
import { SpinnerService } from 'src/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models/user';
import { Department } from 'src/models/department';
import { RoleService } from 'src/services/role.service';
import { Roles } from 'src/enums/roles';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  userId: string = '';
  user: User = {} as User;
  plantId: string = '';
  plantName: string = '';
  departmentIds: string[] = [];
  departmentNames: string = '';
  departments: Department[] = [];
  userRole: any;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private plantService: PlantService,
    private departmentService: DepartmentService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    public roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.loadData();
    });
  }

  loadData() {
    this.spinnerService.show();

    let userQuery = "?userId=" + this.userId;

    this.authService.getUsers(userQuery)
      .subscribe({
        next: (data: any) => {
          this.spinnerService.hide();
          this.user = data.body;
          this.departmentIds = this.user.plants[0].departments.toString().split(',');
          this.loadPlantName(this.user.plants[0].plantId);
          this.loadDepartmentNames(this.departmentIds);
          this.userRole = this.user.role as Roles;
        },
        error: (error: any) => {
          this.spinnerService.hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading user data'
          });
        }
      });
  }

  loadPlantName(plantId: string) {
    let plantQuery = "?plantId=" + plantId;
    this.plantService.getPlants(plantQuery).subscribe({
      next: (data: any) => {
        this.plantName = data.body.plantName;
      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading plant data'
        });
      }
    });
  }

  loadDepartmentNames(departmentIds: string[]) {
    this.departments = [];

    departmentIds.forEach(id => {
      let departmentQuery = "?departmentId=" + id;
      this.departmentService.getDepartments(departmentQuery).subscribe({
        next: (data: any) => {
          this.departments.push(data.body);
          this.departmentNames = this.departments.map(d => d.departmentName).join(", ");
        },
        error: (error: any) => {

        }
      });
    });
  }



}

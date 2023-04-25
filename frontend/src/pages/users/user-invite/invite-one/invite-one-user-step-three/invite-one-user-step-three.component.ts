import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Department } from 'src/models/department';
import { Plant } from 'src/models/plant';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-invite-one-user-step-three',
  templateUrl: './invite-one-user-step-three.component.html',
  styleUrls: ['./invite-one-user-step-three.component.scss']
})
export class InviteOneUserStepThreeComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roles: any[] = [];
  plants: Plant[] = [];
  selectedPlants: Plant[] = [];
  selectedPlant: Plant = {} as Plant;
  departments: Department[] = [];

  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private departmentService: DepartmentService) {

    this.sharedService.setDataKey('inviteUser');
    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();

      this.selectedPlants = this.request.plants || [];
      this.selectedPlant = this.selectedPlants[0] || null;
    }


  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {
    if (this.selectedPlant) {

      this.loadData();
    }


  }

  loadData() {
    let query = `?plantId=${this.selectedPlant.plantId}`;
    this.departmentService.getDepartments(query).subscribe({
      next: (data) => {

        this.departments = data.body.departments.map((department: any) => {
          const existingDepartment = this.selectedPlant.departments.find((d: any) => d.departmentId === department._id);
          return {
            departmentName: department.departmentName,
            departmentId: department._id,
            checked: existingDepartment ? true : false,
            plantId: department.plantId
          };
        });

      }
    });
  }
  onSubmit() {
    this.spinnerService.show();

    this.spinnerService.hide();

    this.sharedService.setData(this.request);

    for (const plant of this.request.plants) {
      plant.departments = plant.departments.map((d: any) => d.departmentId);
    }

    let inviteRequest = {
      invites: [
        this.request
      ]
    }


    this.authService.inviteUsers(inviteRequest).subscribe({
      next: (data) => {


        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User invited successfully. An email has been sent out to the user with an invite link.' });
        this.router.navigate(['/dashboard/users/list']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while inviting user' });
        this.spinnerService.hide();
      }
    });


  }
  onCheckboxChange(event: any, department: any) {

    const plant = this.selectedPlants.find(p => p.plantId === department.plantId);
    if (!plant) {
      console.error(`Plant with ID ${department.plantId} not found in selectedPlants`);
      return;
    }

    if (event.checked) {
      plant.departments.push({ departmentName: department.departmentName, departmentId: department.departmentId, checked: true });
    } else {
      const index = plant.departments.findIndex(d => d.departmentId === department.departmentId);
      if (index !== -1) {
        plant.departments.splice(index, 1);
      }
    }

    const index = this.plants.findIndex(p => p.plantId === department.plantId);

    if (index !== -1) {
      this.plants[index].checked = plant.departments.length > 0;
    }

    this.request.plants = this.selectedPlants;

    this.sharedService.setData(this.request);
  }


  changePlant($event: any) {

    this.loadData();
  }



}

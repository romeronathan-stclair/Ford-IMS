import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-create-plants-departments',
  templateUrl: './create-plants-departments.component.html',
  styleUrls: ['./create-plants-departments.component.scss']
})
export class CreatePlantsDepartmentsComponent implements OnInit {
  departments = [{ name: '' }];


  request: any;

  constructor(private messageService: MessageService, private spinnerService: SpinnerService, private sharedService: SharedService, private router: Router, private plantService: PlantService) {
    this.sharedService.setDataKey('plants');

    this.request = this.sharedService.getData();

    if (this.request.departments) {
      this.departments = this.request.departments.map((department: string) => {
        return { name: department };
      });
    }

  }

  ngOnInit() {

    this.spinnerService.showHide();

  }

  addDepartment() {
    this.departments.push({ name: '' });
  }
  removeDepartment(i: number) {
    this.departments.splice(i, 1);
  }
  submit() {
    this.spinnerService.showHide();


    this.request.departments = this.departments
      .filter(department => department.name !== '') // filter out empty department names
      .map(department => department.name); // map the remaining department names to new array

    this.sharedService.setData(this.request);
    const departmentNames = this.departments.map(department => department.name);
    const uniqueDepartmentNames = [...new Set(departmentNames)];
    if (departmentNames.length !== uniqueDepartmentNames.length) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There are departments with the same name.' });
    } else {
      if (this.request.users) {
        this.request.users = this.request.users.map((user: any) => {
          const updatedDepartments = user.departments.filter((department: any) =>
            this.departments.some((d: any) => d.name === department)
          );

          const newDepartments = this.departments.filter((department: any) =>
            !user.departments.includes(department.name)
          );

          return { ...user, departments: [...updatedDepartments, ...newDepartments] };
        });

      }
      this.router.navigate(['/dashboard/plants/create/step-three']);
    }

  }

}

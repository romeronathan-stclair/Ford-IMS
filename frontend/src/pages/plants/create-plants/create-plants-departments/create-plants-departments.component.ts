import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-create-plants-departments',
  templateUrl: './create-plants-departments.component.html',
  styleUrls: ['./create-plants-departments.component.scss']
})
export class CreatePlantsDepartmentsComponent implements OnInit {
  departments = [{ name: '' }];


  request: any;

  constructor(private sharedService: SharedService, private router: Router, private plantService: PlantService) {
    this.sharedService.setDataKey('plants');

    this.request = this.sharedService.getData();

  }

  ngOnInit() {



  }

  addDepartment() {
    this.departments.push({ name: '' });
  }
  removeDepartment(i: number) {
    this.departments.splice(i, 1);
  }
  submit() {
    this.request.departments = this.departments
      .filter(department => department.name !== '') // filter out empty department names
      .map(department => department.name); // map the remaining department names to new array

    this.sharedService.setData(this.request);



    // this.plantService.createPlant(this.request).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });

    this.router.navigate(['/dashboard/plants/create/step-three']);
  }

}

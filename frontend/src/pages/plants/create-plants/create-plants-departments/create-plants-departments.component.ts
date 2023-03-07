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
    console.log(this.request);


  }

  addDepartment() {
    this.departments.push({ name: '' });
  }
  removeDepartment(i: number) {
    this.departments.splice(i, 1);
  }
  submit() {
    this.request.departments = this.departments.map((department) => {
      return department.name;
    });
    this.sharedService.setData(this.request);

    console.log(this.request);

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

import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Plant } from 'src/models/plant';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-edit-user-plants',
  templateUrl: './edit-user-plants.component.html',
  styleUrls: ['./edit-user-plants.component.scss']
})
export class EditUserPlantsComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roles: any[] = [];
  plants: Plant[] = [];
  selectedPlants: Plant[] = [];
  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService) {

    this.sharedService.setDataKey('editUser');

    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();
      this.selectedPlants = this.request.plants || [];

    }
  }

  ngOnInit(): void {
    console.log(this.request);
    this.plantService.getPlants('').subscribe({
      next: (data) => {

        this.plants = data.body.plants.map((plant: any) => {
          const existingPlant = this.selectedPlants.find(p => p.plantId === plant._id);
          return {
            plantName: plant.plantName,
            plantId: plant._id,
            checked: existingPlant ? true : false,
            departments: existingPlant ? existingPlant.departments : []
          };
        });
      }, error: (error) => {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while fetching plants' });
        console.log(error);
      }

    });


  }

  onSubmit() {
    this.spinnerService.showHide();

    this.sharedService.setData(this.request);

    this.router.navigate(["/dashboard/users/edit/reassign-departments"]);
  }

  onCheckboxChange(event: any, plant: any) {
    if (event.checked) {
      this.selectedPlants.push(plant);
    } else {
      this.selectedPlants = this.selectedPlants.filter(p => p.plantId !== plant.plantId);
    }

    const index = this.plants.findIndex(p => p.plantId === plant.plantId);

    if (index !== -1) {
      this.plants[index].checked = event.checked;
    }

    this.request.plants = this.selectedPlants;

    this.sharedService.setData(this.request);

  }

  goBack() {
    this.location.back();
  }

}

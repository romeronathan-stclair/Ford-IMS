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
  selector: 'app-invite-one-user-step-two',
  templateUrl: './invite-one-user-step-two.component.html',
  styleUrls: ['./invite-one-user-step-two.component.scss']
})
export class InviteOneUserStepTwoComponent {
  public displayValidationErrors: boolean = false;
  request: any;
  roles: any[] = [];
  plants: any[] = [];
  selectedPlants: Plant[] = [];
  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService) {

    this.sharedService.setDataKey('inviteUser');

    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();
      this.selectedPlants = this.request.plants || [];

    }
  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {
    this.roles = [
      { label: 'Admin', value: 'Admin' },
      { label: 'User', value: 'User' },
    ];

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
    this.spinnerService.show();

    this.spinnerService.hide();

    this.sharedService.setData(this.request);

    this.router.navigate(["/dashboard/users/invite/invite-one-user/step-three"]);

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







}

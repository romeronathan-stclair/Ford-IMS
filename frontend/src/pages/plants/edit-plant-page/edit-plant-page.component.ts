import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-edit-plant-page',
  templateUrl: './edit-plant-page.component.html',
  styleUrls: ['./edit-plant-page.component.scss'],
  providers: [PlantService, ConfirmationService]
})
export class EditPlantPageComponent {
  public displayValidationErrors: boolean = false;
  plantForm: FormGroup;
  plantId: string = ''; // add a variable to hold the plant id
  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute, // add ActivatedRoute to the constructor
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

    this.plantForm = this.formBuilder.group({
      plantName: new FormControl(''),
      plantLocation: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.plantId = params['id']; // get the plant id from the route params
      this.loadPlantData(); // call a method to load the plant data
    });
  }

  loadPlantData() {
    this.spinnerService.show();
    let query = "?plantId=" + this.plantId;
    this.plantService.getPlants(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log(data);
        if (data) {
          // populate the form controls with the plant data
          this.plantForm.patchValue({
            plantName: data.body.plantName,
            plantLocation: data.body.plantLocation
          });
        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to get plant data.`,
        });
        return;
      }
    });
  }

  deletePlant(plantId: any,) {
    this.confirmationService.confirm({

      message: 'Are you sure that you want to delete this plant?',
      accept: () => {
        this.spinnerService.show();
        console.log(plantId);
        this.plantService.deletePlant(plantId)
        .subscribe({
          next: (data: any) => {
            this.spinnerService.hide();
            console.log(data);
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: `Success: `,
              detail: `Plant deleted successfully.`,
            });
            this.router.navigate(['/dashboard/plants/list']);
          },
          error: (error: any) => {
            this.spinnerService.hide();
            console.log(error);
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: `Error: `,
              detail: `Failed to delete plant.`,
            });
            return;
          }
        });
      },
      reject: () => {
        //reject action
      }
    });
  }

  onSubmit() {
    if (!this.plantForm.valid) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }
    this.spinnerService.show();
    const plant = {
      plantName: this.plantForm.value.plantName,
      plantLocation: this.plantForm.value.plantLocation,
      plantId: this.plantId
    }

    this.sharedService.setData(plant);

    let query = "?plantName=" + plant.plantName;

    this.plantService.editPlant(plant).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log(data);
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Plant data updated successfully.`,
        });

        this.router.navigate(['/dashboard/plants/list']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Failed to update plant data.`,
        });
        return;

      }
    });
  }
}

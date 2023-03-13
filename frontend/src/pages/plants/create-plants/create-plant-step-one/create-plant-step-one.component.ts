import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-create-plant-step-one',
  templateUrl: './create-plant-step-one.component.html',
  styleUrls: ['./create-plant-step-one.component.scss'],
  providers: [MessageService],
})
export class CreatePlantStepOneComponent {
  public displayValidationErrors: boolean = false;
  plantForm: FormGroup;
  request: any;
  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private spinnerService: SpinnerService,

    private messageService: MessageService) {
    this.plantForm = this.formBuilder.group({
      plantName: new FormControl(''),
      plantLocation: new FormControl(''),
    });
    this.sharedService.setDataKey('plants');
    if (this.sharedService.getData() != null) {
      this.request = this.sharedService.getData();
      this.plantForm.patchValue(
       this.request.plant
      );
    }

  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {

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
    }

    this.request.plant = plant;

    this.sharedService.setData(this.request);

    let query = "?plantName=" + plant.plantName;

    this.plantService.getPlants(query).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        console.log("DATA =>" + data);
        if (data.body) {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: `Error: `,
            detail: `Plant name already exists.`,
          });
          return;

        }
        this.router.navigate(['/dashboard/plants/create/step-two']);
      },
      error: (error: any) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Plant name already exists.`,
        });
        return;

      }
    });


  }
}

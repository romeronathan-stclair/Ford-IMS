import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-create-plant-step-one',
  templateUrl: './create-plant-step-one.component.html',
  styleUrls: ['./create-plant-step-one.component.scss'],
  providers: [MessageService],
})
export class CreatePlantStepOneComponent {
  public displayValidationErrors: boolean = false;
  plantForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,

    private messageService: MessageService) {
    this.plantForm = this.formBuilder.group({
      plantName: new FormControl(''),
      plantLocation: new FormControl(''),
    });
    this.sharedService.setDataKey('plants');
    if (this.sharedService.getData() != null) {
      this.plantForm.patchValue(
        this.sharedService.getData()
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
      return;
    }

    const plant = {
      plantName: this.plantForm.value.plantName,
      plantLocation: this.plantForm.value.plantLocation,
    }

    this.sharedService.setData(plant);

    this.router.navigate(['/dashboard/plants/create/step-two']);

  }


}

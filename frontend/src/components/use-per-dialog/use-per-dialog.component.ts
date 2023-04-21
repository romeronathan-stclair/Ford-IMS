import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from 'src/models/department';

@Component({
  selector: 'app-use-per-dialog',
  templateUrl: './use-per-dialog.component.html',
  styleUrls: ['./use-per-dialog.component.scss']
})
export class UsePerDialogComponent {
  departments: Department[] = [];
  public displayValidationErrors: boolean = false;
  valueForm: FormGroup;
  selectedDepartments: Department[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UsePerDialogComponent>,


  ) {
    this.valueForm = new FormGroup({
      value: new FormControl(''),
    });

  }




  ngOnInit(): void {

  }
  onSubmit() {

    if (!this.valueForm.valid) {
      this.displayValidationErrors = true;

      return;
    }


    this.dialogRef.close(this.valueForm.value.value);
  }
  close() {
    this.dialogRef.close();
  }

}

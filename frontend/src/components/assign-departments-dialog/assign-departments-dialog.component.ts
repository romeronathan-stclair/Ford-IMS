import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assign-departments-dialog',
  templateUrl: './assign-departments-dialog.component.html',
  styleUrls: ['./assign-departments-dialog.component.scss']
})
export class AssignDepartmentsDialogComponent {
  departments: any[] = [];
  selectedDepartments: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignDepartmentsDialogComponent>,


  ) {

  }




  ngOnInit(): void {
    // Check the selected departments based on their names
    this.data.departments.forEach((department: any) => {
      if (this.data.userDepartments && this.data.userDepartments.includes(department)) {
        this.departments.push({
          checked: true,
          name: department
        });
        this.selectedDepartments.push(department);
      } else {
        this.departments.push({
          checked: false,
          name: department
        });
      }
    });
  }
  onCheckboxChange(event: any, department: any) {
    if (event.checked) {
      // Add user to array of selected users
      this.departments.filter(d => d.name === department).forEach(d => d.checked = true);



    } else {
      // Remove user from array of selected users
      this.departments.filter(d => d.name === department).forEach(d => d.checked = false);
    }
  }
  submit() {
    this.selectedDepartments = this.departments.filter(d => d.checked).map(d => d.name);


    this.dialogRef.close(this.selectedDepartments);
  }

}

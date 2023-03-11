import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignDepartmentsDialogComponent } from 'src/components/assign-departments-dialog/assign-departments-dialog.component';
import { SpinnerService } from 'src/services/spinner.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-create-plant-assign-users',
  templateUrl: './create-plant-assign-users.component.html',
  styleUrls: ['./create-plant-assign-users.component.scss']
})
export class CreatePlantAssignUsersComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [
    "name",
    "email",
    "checkbox"
  ];
  request: any;
  selectedUsers: any[] = [];

  constructor(public dialog: MatDialog,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService,
    private plantService: PlantService,
    private spinnerService: SpinnerService) {
    this.sharedService.setDataKey('plants');

    this.request = this.sharedService.getData();
  }

  ngOnInit() {

    if (this.request.users) {
      this.selectedUsers = this.request.users;
      this.dataSource.data = this.request.users;
    }

  }
  removeUser(id: string) {

    console.log(id);
    if (!id) {
      return;
    }
    this.selectedUsers = this.selectedUsers.filter((user) => {
      return user.userId.toString() !== id;
    });
    this.dataSource.data = this.selectedUsers;
    this.request.users = this.selectedUsers;
    this.sharedService.setData(this.request);
  }

  openDialog(user: any) {


    console.log(user);

    const dialogRef = this.dialog.open(AssignDepartmentsDialogComponent, {

      data: {
        userDepartments:
          user.departments,
        departments: this.request.departments,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (!result) {
        return;
      }
      const index = this.selectedUsers.findIndex((u) => u.userId === user.userId);
      if (index !== -1) {
        this.selectedUsers[index].departments = result;
      }

      this.request.users = this.selectedUsers;
      this.sharedService.setData(this.request);
      this.dataSource.data = this.selectedUsers;
    });
  }

  submit() {
    this.spinnerService.show();

    let request = {
      assignments: this.selectedUsers,
      departments: this.request.departments,
      plantName: this.request.plantName,
      plantLocation: this.request.plantLocation,
    }

    console.log(request);

    this.plantService.createPlant(request).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.router.navigate(['/dashboard/plants/create/success']);
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${error.error}`,
        });
      }
    });

    console.log(request);
  }
}





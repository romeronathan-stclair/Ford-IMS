import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-create-plants-users',
  templateUrl: './create-plants-users.component.html',
  styleUrls: ['./create-plants-users.component.scss']
})
export class CreatePlantsUsersComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  userForm: FormGroup;
  displayedColumns: string[] = [
    "name",
    "email",
    "checkbox"
  ];
  request: any;
  selectedUsers: any[] = [];

  constructor(private authService: AuthService, private sharedService: SharedService, private router: Router, private plantService: PlantService) {
    this.sharedService.setDataKey('plants');

    this.request = this.sharedService.getData();
    this.selectedUsers = this.request.users || [];

    this.userForm = new FormGroup({
      name: new FormControl(''),
    });

  }

  onCheckboxChange(event: any, user: any) {
    if (event.checked) {
      // Add user to array of selected users
      this.selectedUsers.push(user);
    } else {
      // Remove user from array of selected users
      this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    }

    // Update the checked property of the user object in the dataSource
    const index = this.dataSource.data.findIndex(u => u.userId === user.userId);
    if (index !== -1) {
      this.dataSource.data[index].checked = event.checked;
    }
  }

  ngOnInit() {

    this.authService.getUsers('').subscribe({
      next: (response) => {

        this.dataSource.data = response.body.map((user: any) => {
          const existingUser = this.selectedUsers.find(u => u.userId === user.userId);
          return {
            userId: user._id,
            name: user.name,
            email: user.email,
            checked: existingUser ? true : false,
            departments: existingUser ? existingUser.departments : this.request.departments
          };
        });

      }
    });


  }
  searchByName() {
    const nameControl = this.userForm.get('name');
    if (nameControl) {
      const name = nameControl.value;

      let query = "?name=" + name;

      this.authService.getUsers(query).subscribe({
        next: (response) => {
          this.dataSource.data = response.body.map((user: any) => {
            const existingUser = this.selectedUsers.find(u => u.userId === user.userId);
            return {
              userId: user._id,
              name: user.name,
              email: user.email,
              checked: existingUser ? true : false,
              departments: existingUser ? existingUser.departments : this.request.departments
            };


          });
        }
      });
    }
  }
  addUsers() {
    // Filter the selected users to only include those that are checked
    const selectedCheckedUsers = this.dataSource.data.filter((user) => user.checked);

    // Map the selected users to the desired format


    console.log(selectedCheckedUsers);

    this.request.users = selectedCheckedUsers;
    this.sharedService.setData(this.request);
    this.router.navigate(['/dashboard/plants/create/step-three']);
  }


}


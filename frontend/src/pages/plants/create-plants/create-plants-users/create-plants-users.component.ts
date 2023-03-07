import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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

  }

  ngOnInit() {
    console.log(this.request);

    this.authService.getUsers('').subscribe({
      next: (response) => {
        console.log(response);
        this.dataSource.data = response.body;
      }
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
  }

}


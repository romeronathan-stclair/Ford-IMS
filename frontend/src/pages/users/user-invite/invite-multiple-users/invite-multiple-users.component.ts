import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AssignDepartmentsDialogComponent } from 'src/components/assign-departments-dialog/assign-departments-dialog.component';
import { Invite } from 'src/models/invite';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-invite-multiple-users',
  templateUrl: './invite-multiple-users.component.html',
  styleUrls: ['./invite-multiple-users.component.scss']
})
export class InviteMultipleUsersComponent {
  invites = [] as Invite[];
  roles: any[] = [];
  plants: any[] = [];
  plantsLoaded: boolean = false;

  request: any;

  constructor(private authService: AuthService, private departmentServie: DepartmentService, private dialog: MatDialog, private messageService: MessageService, private spinnerService: SpinnerService, private sharedService: SharedService, private router: Router, private plantService: PlantService) {
    this.sharedService.setDataKey('invite-multiple');

    this.request = this.sharedService.getData();
    console.log(this.request);

    if (this.request.invites) {
      this.invites = this.request.invites;
      console.log(this.invites);
    }
    this.roles = [
      'Admin',
      'Plant Manager',
      'Team Manager',
      'Senior Process Coach',
      'Process Coach',
      'Cycle Checker',
      'Employee'
    ];
  }

  ngOnInit() {

    this.spinnerService.showHide();
    this.loadPlants();

  }

  addInvite() {
    this.invites.push({
      email: '',
      plants: [{
        plantId: '',
        plantName: '',
        departments: [{
          _id: '',
          departmentName: '',
          isDeleted: false,
          plantId: '',
        }]
      }]
    });
    console.log(this.invites);
    this.request.invites = this.invites;
    console.log(this.request);
    this.sharedService.setData(this.request);
    console.log(this.sharedService.getData());
  }
  removeInvite(i: number) {
    this.invites.splice(i, 1);
    this.request.invites = this.invites;
    this.sharedService.setData(this.request);
  }
  submit() {
    this.spinnerService.showHide();

    if (this.invites.length === 0) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add at least one invite.' });
      this.spinnerService.showHide(); // Hide the spinner if there's an error
      return;
    }

    const hasMissingRole = this.invites.some(invite => !invite.adminType);

    if (hasMissingRole) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please assign a role to each invite.' });
      this.spinnerService.showHide(); // Hide the spinner if there's an error
      return;
    }



    const emptyEmails = this.invites
      .filter(invite => invite.email !== '') // filter out empty invite emails

    if (emptyEmails.length !== this.invites.length) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter an email for each invite.' });
      this.spinnerService.showHide(); // Hide the spinner if there's an error
      return;
    }


    this.sharedService.setData(this.request);
    const inviteEmails = this.invites.map(invite => invite.email);
    const uniqueinviteEmails = [...new Set(inviteEmails)];
    if (inviteEmails.length !== uniqueinviteEmails.length) {
      console.log('There are invites with the same email.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There are invites with the same email.' });
      return;
    }
    if (this.invites.length > 0 && this.invites) {


      let request = {
        invites: []
      } as any;
      console.log("INVITES" + JSON.stringify(this.invites));
      for (let invite of this.invites) {



        let departmentIds = invite.plants?.[0]?.departments.map(department => department._id);
        if (invite.plants?.[0]?.plantId === '' || invite.plants?.[0]?.plantId === undefined) {
          request.invites.push({
            email: invite.email,
            adminType: invite.adminType,
          });
          console.log("HEREEEE");
        } else {
          request.invites.push({
            email: invite.email,
            adminType: invite.adminType,
            plants: [{
              plantId: invite.plants?.[0]?.plantId,
              departments: departmentIds
            }]
          });

        }

      }

      console.log(request);
      this.authService.inviteUsers(request).subscribe({
        next: (data) => {


          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Users invited successfully. An email has been sent out to the users with an invite link.' });
          this.router.navigate(['/dashboard/users/list']);
          this.spinnerService.hide();
        },
        error: (error) => {
          console.log(error);
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while inviting user' });
          this.spinnerService.hide();
        }
      });

    }



  }




  // this.plantService.createPlant(this.request).subscribe({
  //   next: (response) => {
  //     console.log(response);
  //   },
  //   error: (error) => {
  //     console.log(error);
  //   }
  // });




  changeRole($event: any, invite: any) {

    invite.adminType = $event.value;

    this.sharedService.setData(this.request);

  }
  changePlant($event: any, invite: any) {
    console.log($event);

    console.log(this.request);

    this.sharedService.setData(this.request);
  }
  changeInviteEmail($event: any, invite: any) {

    invite.email = $event.target.value;
    this.sharedService.setData(this.request);
  }





  loadPlants() {
    this.plantService.getPlants('').subscribe({
      next: (data) => {
        console.log(data);

        this.plants = data.body.plants.map((plant: any) => {
          return {
            plantId: plant._id,
            plantName: plant.plantName
          };
        });
        this.plantsLoaded = true;


      }
    });

  }
  openDialog(invite: Invite) {
    if (invite.plants && invite.plants?.[0] && invite.plants?.[0]?.plantId) {
      let query = "?plantId=" + invite.plants[0].plantId;

      this.departmentServie.getDepartments(query).subscribe(
        (data) => {
          let mappedDepartmentNames = data.body.departments.map((department: any) => department.departmentName);
          let mappedSelectedDepartmentNames = invite.plants?.[0].departments.map((department: any) => department.departmentName);
          const dialogRef = this.dialog.open(AssignDepartmentsDialogComponent, {

            data: { departments: mappedDepartmentNames, userDepartments: mappedSelectedDepartmentNames }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && invite.plants?.[0]) {
              let mappedDepartments = data.body.departments.filter((department: any) => result.includes(department.departmentName));
              invite.plants[0].departments = mappedDepartments;
              console.log(invite);

              this.sharedService.setData(this.request);
            }
          });
        }
      );
    } else {
      console.log(invite);
      // Handle the case when 'invite.plants' is undefined or empty
    }
  }


}

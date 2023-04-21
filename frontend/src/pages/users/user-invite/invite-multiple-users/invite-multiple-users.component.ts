import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AssignDepartmentsDialogComponent } from 'src/components/assign-departments-dialog/assign-departments-dialog.component';
import { Invite } from 'src/models/invite';
import { AuthService } from 'src/services/auth.service';
import { DepartmentService } from 'src/services/department.service';
import { PlantService } from 'src/services/plant.service';
import { RoleService } from 'src/services/role.service';
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

  constructor(public roleService: RoleService, private authService: AuthService, private departmentServie: DepartmentService, private dialog: MatDialog, private messageService: MessageService, private spinnerService: SpinnerService, private sharedService: SharedService, private router: Router, private plantService: PlantService) {
    this.sharedService.setDataKey('invite-multiple');

    this.request = this.sharedService.getData();

    if (this.request.invites) {
      this.invites = this.request.invites;
    }
    this.roles = this.roleService.getRolesUnderUser();
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
    this.request.invites = this.invites;
    this.sharedService.setData(this.request);
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There are invites with the same email.' });
      return;
    }
    if (this.invites.length > 0 && this.invites) {


      let request = {
        invites: []
      } as any;
      for (let invite of this.invites) {



        if (invite.plants?.[0]?.plantId === '' || invite.plants?.[0]?.plantId === undefined) {
          request.invites.push({
            email: invite.email,
            adminType: invite.adminType,
          });
        } else {
          let departmentIds = [] as any;
          if(invite.plants?.[0]?.departments){
            departmentIds = invite.plants?.[0]?.departments.map(department => department._id);
            }
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

      this.authService.inviteUsers(request).subscribe({
        next: (data) => {


          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Users invited successfully. An email has been sent out to the users with an invite link.' });
          this.router.navigate(['/dashboard/users/list']);
          this.spinnerService.hide();
        },
        error: (error) => {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while inviting user' });
          this.spinnerService.hide();
        }
      });

    }


  }


  changeRole($event: any, invite: any) {

    invite.adminType = $event.value;

    this.sharedService.setData(this.request);

  }
  changePlant($event: any, invite: any) {

    this.sharedService.setData(this.request);
  }
  changeInviteEmail($event: any, invite: any) {

    invite.email = $event.target.value;
    this.sharedService.setData(this.request);
  }





  loadPlants() {
    this.plantService.getPlants('').subscribe({
      next: (data) => {

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
          let mappedSelectedDepartmentNames;
          if (invite.plants?.[0].departments) {
            mappedSelectedDepartmentNames = invite.plants?.[0].departments.map((department: any) => department.departmentName);
          }

          const dialogRef = this.dialog.open(AssignDepartmentsDialogComponent, {

            data: { departments: mappedDepartmentNames, userDepartments: mappedSelectedDepartmentNames }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && invite.plants?.[0]) {
              let mappedDepartments = data.body.departments.filter((department: any) => result.includes(department.departmentName));
              invite.plants[0].departments = mappedDepartments;

              this.sharedService.setData(this.request);
            }
          });
        }
      );
    } else {
      // Handle the case when 'invite.plants' is undefined or empty
    }
  }


}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.scss']
})
export class EditUserInfoComponent {
  public displayValidationErrors: boolean = false;
  userForm: FormGroup;
  request: any;
  selectedRole: string = '';
  name: string = '';
  email: string = '';
  adminType: string = '';
  roles = [
    'Super Admin',
    'Plant Manager',
    'Team Manager',
    'Senior Process Coach',
    'Process Coach',
    'Cycle Checker',
    'Employee'
  ];
  userId: string = '';

  constructor(
    private plantService: PlantService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private messageService: MessageService) {
    this.userForm = this.formBuilder.group({
      fullName: new FormControl(''),
      email: new FormControl(''),
      adminType: new FormControl(''),
    });

    this.sharedService.setDataKey('editUser');

    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();
      this.userForm.patchValue(
        this.request
      );
    }
  }

  async ngOnInit() {
    this.spinnerService.showHide();
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.loadUserData();
    });
  }

  loadUserData() {
    this.spinnerService.show();

    let query = "?userId=" + this.userId;

    this.authService.getUsers(query)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        if (data) {
          this.selectedRole = data.body.role;
          this.userForm.patchValue({
            fullName: data.body.name,
            email: data.body.email,
            adminType: this.selectedRole
          });
          this.name = data.body.name;
          this.email = data.body.email;
          this.adminType = data.body.role;
          this.request.adminType = this.selectedRole;
          this.userForm.get('adminType')?.setValue(this.selectedRole);
        }
      }
    })
  }

  changeLocation() {
    this.spinnerService.showHide();

    this.request.name = this.name;
    this.request.email = this.email;
    this.request.adminType = this.adminType;
    this.request.userId = this.userId;

    this.sharedService.setData(this.request).then(() => {
      this.router.navigate(["/dashboard/users/edit/reassign-plants"]);
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.displayValidationErrors = true;
      return;
    }

    this.spinnerService.show();

    this.request = {
      name: this.userForm.value.fullName,
      email: this.userForm.value.email,
      adminType: this.userForm.value.adminType,
      userId: this.userId
    }

    this.authService.updateUser(this.request)
    .subscribe({
      next: (data: any) => {
        this.spinnerService.hide();
        if (data) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.router.navigate(['/dashboard/users/list']);
        }
      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
        return;
      }
    });
  }

  changeRole($event: any) {
    this.request.adminType = $event.value;
  }


}

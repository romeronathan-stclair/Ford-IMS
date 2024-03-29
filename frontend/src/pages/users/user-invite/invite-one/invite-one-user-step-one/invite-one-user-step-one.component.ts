import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { PlantService } from 'src/services/plant.service';
import { RoleService } from 'src/services/role.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-invite-one-user-step-one',
  templateUrl: './invite-one-user-step-one.component.html',
  styleUrls: ['./invite-one-user-step-one.component.scss']
})
export class InviteOneUserStepOneComponent {
  public displayValidationErrors: boolean = false;
  userForm: FormGroup;
  request: any;
  roles: any[] = [];

  constructor(
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    public roleService: RoleService,

    private messageService: MessageService) {
    this.userForm = this.formBuilder.group({
      fullName: new FormControl(''),
      email: new FormControl(''),
      adminType: new FormControl(''),

    });

    this.sharedService.setDataKey('inviteUser');

    if (this.sharedService.getData() != null) {

      this.request = this.sharedService.getData();
      this.userForm.patchValue(
        this.request
      );
      this.roles = this.roleService.getRolesUnderUser();

    }

  }
  ngAfterViewInit() {

  }
  ngOnInit(): void {

  }
  onSubmit() {
    this.spinnerService.show();
    if (!this.userForm.valid) {
      this.displayValidationErrors = true;
      this.spinnerService.hide();
      return;
    }

    if (this.userForm.value.adminType === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a role'
      });
      this.spinnerService.hide();
      return;
    }

    this.request.fullName = this.userForm.value.fullName;
    this.request.email = this.userForm.value.email;
    this.request.adminType = this.userForm.value.adminType;

    this.spinnerService.hide();
    this.sharedService.setData(this.request).then(() => {
      this.router.navigate(["/dashboard/users/invite/invite-one-user/step-two"]);
    });
  }

  changeRole($event: any) {

    this.request.adminType = $event.value;
    this.sharedService.setData(this.request);

  }








}


import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';
import { CustomValidators } from 'src/utils/custom-validators';

@Component({
  selector: 'app-signup-step-one',
  templateUrl: './signup-step-one.component.html',
  styleUrls: ['./signup-step-one.component.scss']
})
export class SignupStepOneComponent {
  public displayValidationErrors: boolean = false;

  dummyInviteCode: string = '';
  public userForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.userForm = this.formBuilder.group(
      {
        email: new FormControl(''),
        inviteCode: new FormControl(''),
      }

    );

    this.sharedService.setDataKey('invite');
    if (this.sharedService.getData()) {
      this.userForm.patchValue(
        this.sharedService.getData()
      );
    }
  }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.paramMap);
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.userForm.patchValue({
        inviteCode: this.activatedRoute.snapshot.paramMap.get('id'),
      });
    }
  }


  onSubmit() {
    this.spinnerService.show();
    if (!this.userForm.valid) {
      this.spinnerService.hide();
      this.displayValidationErrors = true;
      return;
    }


    let request = {
      email: this.userForm.value.email,
      inviteCode: this.userForm.value.inviteCode,
    };



    let query = "?email=" + request.email + "&token=" + request.inviteCode;

    this.authService.getInvite(query).subscribe({
      next: (data: any) => {
        console.log(data);
        this.spinnerService.hide();

        this.sharedService.setData(request);

        this.router.navigate(['/account/signup/step-two']);

        console.log()

      },
      error: (error: any) => {
        console.log(error);
        this.spinnerService.hide();
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `${error.error}`,
        });
      },
    });

  }

}

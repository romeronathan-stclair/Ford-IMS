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
  selector: 'app-signup-step-two',
  templateUrl: './signup-step-two.component.html',
  styleUrls: ['./signup-step-two.component.scss']
})
export class SignupStepTwoComponent {
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
        fullName: new FormControl(''),
        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(
              /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              { hasSpecialCharacters: true }
            ),
            Validators.minLength(8),
          ]),
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
      }

    );

    this.sharedService.setDataKey('invite');
  }

  ngOnInit(): void {
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

    let request = this.sharedService.getData();



    request.name = this.userForm.value.fullName;
    request.password = this.userForm.value.password;
    request.confirmPassword = this.userForm.value.confirmPassword;

    this.sharedService.setData(request);





    this.authService.signup(request).subscribe({
      next: (data: any) => {
        this.spinnerService.hide();

        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Success: `,
          detail: `Account created successfully`,
        });

        this.router.navigate(['/dashboard/plants/list']);


      },
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.clear();





        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `${error.error || error.errors[0]}`,
        });
      },
    });

  }
}

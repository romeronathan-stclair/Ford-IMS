import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [MessageService],
})
export class LoginPageComponent implements OnInit {
  public displayValidationErrors: boolean = false;
  private user = {} as User;
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService) {
    this.userForm = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }
  onSubmit() {
    if (!this.userForm.valid) {
      this.displayValidationErrors = true;
      return;
    }

    const stringField = JSON.stringify(this.userForm.value);
    const jsonField = JSON.parse(stringField);

    this.authService.signin(jsonField).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/plants/list']);
      },
      error: (error: any) => {
        console.log(error);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: `Error: `,
          detail: `Your email or password is incorrect.`,
        });
      },
    });
  }
}

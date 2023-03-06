import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthNoGuard } from 'src/guards/auth.no.guard';
import { AccountPageComponent } from 'src/pages/account/account-page/account-page.component';
import { LoginPageComponent } from 'src/pages/account/login-page/login-page.component';
import { DashboardComponent } from '../pages/account/dashboard/dashboard/dashboard.component';
const routes: Routes = [
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [AuthNoGuard],
    data: { animation: 'Account Page' },
    children: [
      {
        path: 'login',
        data: { animation: 'Login Page' },
        component: LoginPageComponent,
      },
    ],
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { animation: 'Home Page' },
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
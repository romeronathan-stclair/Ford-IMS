import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthNoGuard } from 'src/guards/auth.no.guard';
import { AccountPageComponent } from 'src/pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from 'src/pages/account/accounts/login-page/login-page.component';
import { SignoutPageComponent } from 'src/pages/account/accounts/signout-page/signout-page.component';
import { DepartmentListComponent } from 'src/pages/departments/department-list/department-list.component';
import { DepartmentsComponent } from 'src/pages/departments/departments/departments.component';
import { CreatePlantAssignUsersComponent } from 'src/pages/plants/create-plants/create-plant-assign-users/create-plant-assign-users.component';
import { CreatePlantSuccessComponent } from 'src/pages/plants/create-plants/create-plant-success/create-plant-success.component';
import { CreatePlantComponent } from 'src/pages/plants/create-plants/create-plant/create-plant.component';
import { CreatePlantsDepartmentsComponent } from 'src/pages/plants/create-plants/create-plants-departments/create-plants-departments.component';
import { CreatePlantsUsersComponent } from 'src/pages/plants/create-plants/create-plants-users/create-plants-users.component';
import { EditPlantPageComponent } from 'src/pages/plants/edit-plant-page/edit-plant-page.component';
import { PlantListComponent } from 'src/pages/plants/plant-list/plant-list.component';
import { PlantsComponent } from 'src/pages/plants/plants/plants.component';
import { DashboardComponent } from '../pages/account/dashboard/dashboard/dashboard.component';
import { CreatePlantStepOneComponent } from '../pages/plants/create-plants/create-plant-step-one/create-plant-step-one.component';
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
      }
    ],
  },
  {
    path: '',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { animation: 'Home Page' },
    children: [
      {
        path: 'plants',
        data: { animation: 'Plants Page' },
        component: PlantsComponent,
        children: [
          {
            path: 'create',
            data: { animation: 'Create Plant Page' },
            component: CreatePlantComponent,
            children: [
              {
                path: 'step-one',
                component: CreatePlantStepOneComponent,
              },
              {
                path: 'step-two',
                component: CreatePlantsDepartmentsComponent,
              },
              {
                path: 'step-three',
                component: CreatePlantAssignUsersComponent
              }, {
                path: 'step-three',
                component: CreatePlantAssignUsersComponent,
              },
              {
                path: 'step-three-users',
                component: CreatePlantsUsersComponent
              },
              {
                path: 'success',
                component: CreatePlantSuccessComponent
              }
            ]
          },
          {
            path: 'list',
            data: { animation: 'Plants Page' },
            component: PlantListComponent,
          },
          {
            path: 'edit/:id',
            data: { animation: 'Edit Plant Page' },
            component: EditPlantPageComponent

          }
        ]
      },
      {
        path: 'departments',
        data: { animation: 'Departments Page' },
        component: DepartmentsComponent,
        children: [
          {
            path: 'list',
            data: { animation: 'Plants Page' },
            component: DepartmentListComponent,
          },
        ]

      }

    ]
  },
  {
    path: 'signout',
    data: { animation: 'Signout Page' },
    component: SignoutPageComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }

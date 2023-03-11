import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthNoGuard } from 'src/guards/auth.no.guard';
import { AccountPageComponent } from 'src/pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from 'src/pages/account/accounts/login-page/login-page.component';
import { SignoutPageComponent } from 'src/pages/account/accounts/signout-page/signout-page.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard/dashboard.component';
import { CreateDepartmentComponent } from 'src/pages/departments/create-department/create-department.component';
import { DepartmentListComponent } from 'src/pages/departments/department-list/department-list.component';
import { DepartmentsComponent } from 'src/pages/departments/departments/departments.component';
import { EditDepartmentComponent } from 'src/pages/departments/edit-department/edit-department.component';
import { CreatePlantAssignUsersComponent } from 'src/pages/plants/create-plants/create-plant-assign-users/create-plant-assign-users.component';
import { CreatePlantStepOneComponent } from 'src/pages/plants/create-plants/create-plant-step-one/create-plant-step-one.component';
import { CreatePlantSuccessComponent } from 'src/pages/plants/create-plants/create-plant-success/create-plant-success.component';
import { CreatePlantComponent } from 'src/pages/plants/create-plants/create-plant/create-plant.component';
import { CreatePlantsDepartmentsComponent } from 'src/pages/plants/create-plants/create-plants-departments/create-plants-departments.component';
import { CreatePlantsUsersComponent } from 'src/pages/plants/create-plants/create-plants-users/create-plants-users.component';
import { EditPlantPageComponent } from 'src/pages/plants/edit-plant-page/edit-plant-page.component';
import { PlantListComponent } from 'src/pages/plants/plant-list/plant-list.component';
import { PlantsComponent } from 'src/pages/plants/plants/plants.component';
import { EditStockComponent } from 'src/pages/stocks/edit-stock/edit-stock.component';
import { StockListComponent } from 'src/pages/stocks/stock-list/stock-list.component';
import { StocksComponent } from 'src/pages/stocks/stocks/stocks.component';
import { UserListComponent } from 'src/pages/users/user-list/user-list.component';
import { UsersComponent } from 'src/pages/users/users/users.component';

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
            data: { animation: 'Department List Page' },
            component: DepartmentListComponent,
          },
          {
            path: 'create',
            data: { animation: 'Create Department Page' },
            component: CreateDepartmentComponent
          },
          {
            path: 'edit/:id',
            data: { animation: 'Edit Department Page' },
            component: EditDepartmentComponent
          }
        ]

      },
      {
        path: 'stock',
        data: { animation: 'Stock Page' },
        component: StocksComponent,
        children: [
          {
            path: 'list',
            data: { animation: 'Stock List Page' },
            component: StockListComponent,
          },
          {
            path: 'edit/:id',
            data: { animation: 'Edit Stock Page' },
            component: EditStockComponent
          }
        ]

      },
      {
        path: 'users',
        data: { animation: 'Users Page' },
        component: UsersComponent,
        children: [{
          path: 'list',
          data: { animation: 'Users List Page' },
          component: UserListComponent

        }
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

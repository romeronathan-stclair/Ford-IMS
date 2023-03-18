import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthNoGuard } from 'src/guards/auth.no.guard';
import { AccountPageComponent } from 'src/pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from 'src/pages/account/accounts/login-page/login-page.component';
import { SignoutPageComponent } from 'src/pages/account/accounts/signout-page/signout-page.component';
import { SignupPageComponent } from 'src/pages/account/accounts/signup-page/signup-page.component';
import { SignupStepOneComponent } from 'src/pages/account/accounts/signup-page/signup-step-one/signup-step-one.component';
import { SignupStepTwoComponent } from 'src/pages/account/accounts/signup-page/signup-step-two/signup-step-two.component';
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
import { CreateStockStepOneComponent } from 'src/pages/stocks/create-stocks/create-stock-step-one/create-stock-step-one.component';
import { CreateStockStepTwoComponent } from 'src/pages/stocks/create-stocks/create-stock-step-two/create-stock-step-two.component';
import { CreateStockStepThreeComponent } from 'src/pages/stocks/create-stocks/create-stock-step-three/create-stock-step-three.component';
import { CreateStockSuccessComponent } from 'src/pages/stocks/create-stocks/create-stock-success/create-stock-success.component';
import { CreateStockComponent } from 'src/pages/stocks/create-stocks/create-stock/create-stock.component';
import { EditStockComponent } from 'src/pages/stocks/edit-stocks/edit-stock/edit-stock.component';
import { StockListComponent } from 'src/pages/stocks/stock-list/stock-list.component';
import { StocksComponent } from 'src/pages/stocks/stocks/stocks.component';
import { InviteOneUserStepOneComponent } from 'src/pages/users/user-invite/invite-one/invite-one-user-step-one/invite-one-user-step-one.component';
import { InviteOneUserStepThreeComponent } from 'src/pages/users/user-invite/invite-one/invite-one-user-step-three/invite-one-user-step-three.component';
import { InviteOneUserStepTwoComponent } from 'src/pages/users/user-invite/invite-one/invite-one-user-step-two/invite-one-user-step-two.component';
import { InviteOneUserComponent } from 'src/pages/users/user-invite/invite-one/invite-one-user/invite-one-user.component';
import { InviteUsersComponent } from 'src/pages/users/user-invite/invite-users/invite-users.component';
import { UserListComponent } from 'src/pages/users/user-list/user-list.component';
import { UsersComponent } from 'src/pages/users/users/users.component';
import { DunnagesComponent } from 'src/pages/dunnages/dunnages/dunnages.component';
import { DunnageListComponent } from 'src/pages/dunnages/dunnage-list/dunnage-list.component';
import { CreateDunnageComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage/create-dunnage.component';
import { CreateDunnageStepOneComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-step-one/create-dunnage-step-one.component';
import { CreateDunnageStepTwoComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-step-two/create-dunnage-step-two.component';
import { CreateDunnageSuccessComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-success/create-dunnage-success.component';
import { EditDunnageComponent } from 'src/pages/dunnages/edit-dunnages/edit-dunnage/edit-dunnage.component';
import { EditDunnageImageComponent } from 'src/pages/dunnages/edit-dunnages/edit-dunnage-image/edit-dunnage-image.component';
import { EditDunnageRouterComponent } from 'src/pages/dunnages/edit-dunnages/edit-dunnage-router/edit-dunnage-router.component';
import { ViewDunnageComponent } from 'src/pages/dunnages/view-dunnage/view-dunnage.component';
import { ViewStockComponent } from 'src/pages/stocks/view-stock/view-stock.component';
import { EditStockInfoComponent } from 'src/pages/stocks/edit-stocks/edit-stock-info/edit-stock-info.component';
import { EditStockDepartmentComponent } from 'src/pages/stocks/edit-stocks/edit-stock-department/edit-stock-department.component';
import { EditStockImageComponent } from 'src/pages/stocks/edit-stocks/edit-stock-image/edit-stock-image.component';

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
      {
        path: 'signup',
        data: { animation: 'Signup Page' },
        component: SignupPageComponent,
        children: [
          {
            path: 'step-one/:id',
            component: SignupStepOneComponent
          },
          {
            path: 'step-one',
            component: SignupStepOneComponent
          },
          {
            path: 'step-two',
            component: SignupStepTwoComponent
          },
        ]
      },
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
            path: 'create',
            data: { animation: 'Create Stock Page' },
            component: CreateStockComponent,
            children: [
              {
                path: 'step-one',
                component: CreateStockStepOneComponent,
              },
              {
                path: 'step-two',
                component: CreateStockStepTwoComponent,
              },
              {
                path: 'step-three',
                component: CreateStockStepThreeComponent,
              },
              {
                path: 'success',
                component: CreateStockSuccessComponent
              },
            ]
          },
          {
            path: 'list',
            data: { animation: 'Stock Page' },
            component: StockListComponent,
          },
          {
            path: 'edit',
            data: { animation: 'Edit Stock Page' },
            component: EditStockComponent,
            children: [
              {
                path: 'info/:id',
                data: { animation: 'Edit Stock Page' },
                component: EditStockInfoComponent,
              },
              {
                path: 'department-location/:id',
                data: { animation: 'Edit Stock Page' },
                component: EditStockDepartmentComponent,
              },
              {
                path: 'image/:id',
                data: { animation: 'Edit Stock Page' },
                component: EditStockImageComponent,
              }
            ],
          },
          {
            path: 'view-info/:id',
            data: { animation: 'View Stock Page' },
            component: ViewStockComponent
          },
        ]
      },
      {
        path: 'dunnage',
        data: { animation: 'Dunnage Page' },
        component: DunnagesComponent,
        children: [
          {
            path: 'create',
            data: { animation: 'Create Stock Page' },
            component: CreateDunnageComponent,
            children: [
              {
                path: 'step-one',
                component: CreateDunnageStepOneComponent,
              },
              {
                path: 'step-two',
                component: CreateDunnageStepTwoComponent,
              },
              {
                path: 'success',
                component: CreateDunnageSuccessComponent
              },
            ]
          },
          {
            path: 'list',
            data: { animation: 'Dunnage Page' },
            component: DunnageListComponent,
          },
          {
            path: 'view-info/:id',
            data: { animation: 'View Dunnage Page' },
            component: ViewDunnageComponent
          },
          {
            path: 'edit',
            data: { animation: 'Edit Dunnage Page' },
            component: EditDunnageRouterComponent,
            children: [
              {
                path: 'info/:id',
                data: { animation: 'Edit Dunnage Page' },
                component: EditDunnageComponent
              },
              {
                path: 'image/:id',
                data: { animation: 'Edit Dunnage Page' },
                component: EditDunnageImageComponent
              }
            ]
          },
        ],
      },
      {
        path: 'users',
        data: { animation: 'Users Page' },
        component: UsersComponent,
        children: [{
          path: 'list',
          data: { animation: 'Users List Page' },
          component: UserListComponent

        },
        {
          path: 'invite',
          component: InviteUsersComponent,
          children: [
            {
              path: 'invite-one-user',
              component: InviteOneUserComponent,
              children: [
                {
                  path: 'step-one',
                  component: InviteOneUserStepOneComponent
                },
                {
                  path: 'step-two',
                  component: InviteOneUserStepTwoComponent
                },
                {
                  path: 'step-three',
                  component: InviteOneUserStepThreeComponent

                }
              ]
            },
            {
              path: 'invite-users',
              component: InviteUsersComponent
            }
          ]
        }

        ]
      }
    ]
  },
  {
    path: 'signout',
    data: { animation: 'Signout Page' },
    component: SignoutPageComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }

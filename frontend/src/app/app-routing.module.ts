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
import { ProductsComponent } from 'src/pages/products/products/products.component';
import { ProductListComponent } from 'src/pages/products/product-list/product-list.component';
import { CreateProductComponent } from 'src/pages/products/create-products/create-product/create-product.component';
import { CreateProductStepFourComponent } from 'src/pages/products/create-products/create-product-step-four/create-product-step-four.component';
import { CreateProductStepOneComponent } from 'src/pages/products/create-products/create-product-step-one/create-product-step-one.component';
import { CreateProductStepThreeComponent } from 'src/pages/products/create-products/create-product-step-three/create-product-step-three.component';
import { CreateProductStepTwoComponent } from 'src/pages/products/create-products/create-product-step-two/create-product-step-two.component';
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
import { EditProductComponent } from 'src/pages/products/edit-product/edit-product.component';
import { EditProductInformationComponent } from 'src/pages/products/edit-product/edit-product-information/edit-product-information.component';
import { ChangeProductPictureComponent } from 'src/pages/products/edit-product/change-product-picture/change-product-picture.component';
import { ReassignStockComponent } from 'src/pages/products/edit-product/reassign-stock/reassign-stock.component';
import { ReassignDunnageComponent } from 'src/pages/products/edit-product/reassign-dunnage/reassign-dunnage.component';
import { CycleCheckListComponent } from 'src/pages/cycle-check/cycle-check-list/cycle-check-list.component';
import { CycleCheckStepOneComponent } from 'src/pages/cycle-check/cycle-check-process/cycle-check-step-one/cycle-check-step-one.component';
import { CycleCheckRouterComponent } from 'src/pages/cycle-check/cycle-check-process/cycle-check-router/cycle-check-router.component';
import { CycleCheckComponent } from 'src/pages/cycle-check/cycle-check/cycle-check.component';
import { SubAssemblyComponent } from 'src/pages/sub-assembly/sub-assembly/sub-assembly.component';
import { SubAssemblyListComponent } from 'src/pages/sub-assembly/sub-assembly-list/sub-assembly-list.component';
import { SubAssemblyStepOneComponent } from 'src/pages/sub-assembly/sub-assembly-process/sub-assembly-step-one/sub-assembly-step-one.component';
import { SubAssemblyRouterComponent } from 'src/pages/sub-assembly/sub-assembly-process/sub-assembly-router/sub-assembly-router.component';
import { ProductionCountComponent } from 'src/pages/production-count/production-count/production-count.component';
import { ProductionCountCreateComponent } from 'src/pages/production-count/production-count-create/production-count-create.component';
import { ProductionCountStepOneComponent } from 'src/pages/production-count/production-count-step-one/production-count-step-one.component';
import { ProductionCountStepTwoComponent } from 'src/pages/production-count/production-count-step-two/production-count-step-two.component';
import { ProductionCountListComponent } from 'src/pages/production-count/production-count-list/production-count-list.component';
import { ForecastListComponent } from 'src/pages/forecast/forecast-list/forecast-list.component';
import { ForecastComponent } from 'src/pages/forecast/forecast/forecast.component';


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
        path: 'products',
        data: { animation: 'Products Page' },
        component: ProductsComponent,
        children: [
          {
            path: 'list',
            data: { animation: 'Product List Page' },
            component: ProductListComponent,
          },
          {
            path: 'create',
            data: { animation: 'Create Product Page' },
            component: CreateProductComponent,
            children: [
              {
                path: 'step-one',
                component: CreateProductStepOneComponent,
              },
              {
                path: 'step-two',
                component: CreateProductStepTwoComponent,
              },
              {
                path: 'step-three',
                component: CreateProductStepThreeComponent,
              },
              {
                path: 'step-four',
                component: CreateProductStepFourComponent,
              },
            ]

          }, {
            path: 'edit',
            data: { animation: 'Edit Product Page' },
            component: EditProductComponent,
            children: [
              {
                path: 'information/:id',
                data: { animation: 'Edit Product Page' },
                component: EditProductInformationComponent,
              },
              {
                path: 'reassign-stock/:id',
                data: { animation: 'Edit Product Page' },
                component: ReassignStockComponent,
              },
              {
                path: 'reassign-dunnage/:id',
                data: { animation: 'Edit Product Page' },
                component: ReassignDunnageComponent,
              },
              {
                path: 'change-image/:id',

                data: { animation: 'Edit Product Page' },
                component: ChangeProductPictureComponent
              }

            ]

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
      },
      {
        path: 'cycle-check',
        data: { animation: 'Cycle Check Page' },
        component: CycleCheckComponent,
        children: [
          {
            path: 'create',
            data: { animation: 'Create Cycle Check Page' },
            component: CycleCheckRouterComponent,
            children: [
              {
                path: 'step-one',
                component: CycleCheckStepOneComponent
              }
            ],
          },
          {
            path: 'list',
            data: { animation: 'Cycle Check List Page' },
            component: CycleCheckListComponent
          }
        ]
      },
      {
        path: 'sub-assembly',
        data: { animation: 'Sub Assembly Page' },
        component: SubAssemblyComponent,
        children: [
          {
            path: 'create',
            data: { animation: 'Create Sub Assembly Page' },
            component: SubAssemblyRouterComponent,
            children: [
              {
                path: 'step-one',
                component: SubAssemblyStepOneComponent
              }
            ],
          },
          {
            path: 'list',
            data: { animation: 'Sub Assembly List Page' },
            component: SubAssemblyListComponent
          }
        ]
      },
      {
        path: 'production-count',
        data: { animation: 'Production Count Page' },
        component: ProductionCountComponent,
        children: [
          {
            path: 'list',
            data: { animation: 'Cycle Check List Page' },
            component: ProductionCountListComponent
          },
          {
            path: 'create',
            data: { animation: 'Create Cycle Check Page' },
            component: ProductionCountCreateComponent,
            children: [
              {
                path: 'step-one',
                component: ProductionCountStepOneComponent
              },
              {
                path: 'step-two',
                component: ProductionCountStepTwoComponent
              }
            ],
          },
        ]
      },
      {
        path: 'forecast',
        component: ForecastComponent,
        children: [{
          path: 'list',
          component: ForecastListComponent

        }]
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

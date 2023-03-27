import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountPageComponent } from '../pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from '../pages/account/accounts/login-page/login-page.component';
import { DashboardComponent } from '../pages/dashboard/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Toast, ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSimpleSidebarModule } from 'ng-simple-sidebar';
import { SignoutPageComponent } from '../pages/account/accounts/signout-page/signout-page.component';
import { PlantListComponent } from '../pages/plants/plant-list/plant-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FordContainerComponent } from '../components/ford-container/ford-container.component';
import { PlantsComponent } from '../pages/plants/plants/plants.component';
import { CreatePlantComponent } from 'src/pages/plants/create-plants/create-plant/create-plant.component';
import { CreatePlantsDepartmentsComponent } from 'src/pages/plants/create-plants/create-plants-departments/create-plants-departments.component';
import { CreatePlantsUsersComponent } from 'src/pages/plants/create-plants/create-plants-users/create-plants-users.component';
import { CreatePlantStepOneComponent } from '../pages/plants/create-plants/create-plant-step-one/create-plant-step-one.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedService } from 'src/services/shared.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CreatePlantAssignUsersComponent } from '../pages/plants/create-plants/create-plant-assign-users/create-plant-assign-users.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AssignDepartmentsDialogComponent } from '../components/assign-departments-dialog/assign-departments-dialog.component';
import { CreatePlantSuccessComponent } from '../pages/plants/create-plants/create-plant-success/create-plant-success.component';
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerService } from 'src/services/spinner.service';
import { CreateDepartmentComponent } from 'src/pages/departments/create-department/create-department.component';
import { DepartmentListComponent } from 'src/pages/departments/department-list/department-list.component';
import { DepartmentsComponent } from 'src/pages/departments/departments/departments.component';
import { EditDepartmentComponent } from 'src/pages/departments/edit-department/edit-department.component';
import { EditPlantPageComponent } from 'src/pages/plants/edit-plant-page/edit-plant-page.component';
import { UserListComponent } from 'src/pages/users/user-list/user-list.component';
import { UsersComponent } from 'src/pages/users/users/users.component';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { StockListComponent } from 'src/pages/stocks/stock-list/stock-list.component';
import { StocksComponent } from 'src/pages/stocks/stocks/stocks.component';
import { CreateStockComponent } from 'src/pages/stocks/create-stocks/create-stock/create-stock.component';
import { CreateStockStepOneComponent } from 'src/pages/stocks/create-stocks/create-stock-step-one/create-stock-step-one.component';
import { CreateStockStepTwoComponent } from 'src/pages/stocks/create-stocks/create-stock-step-two/create-stock-step-two.component';
import { CreateStockStepThreeComponent } from 'src/pages/stocks/create-stocks/create-stock-step-three/create-stock-step-three.component';
import { CreateStockSuccessComponent } from 'src/pages/stocks/create-stocks/create-stock-success/create-stock-success.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
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
import { EditStockComponent } from 'src/pages/stocks/edit-stocks/edit-stock/edit-stock.component';
import { ViewStockComponent } from 'src/pages/stocks/view-stock/view-stock.component';
import { EditStockInfoComponent } from 'src/pages/stocks/edit-stocks/edit-stock-info/edit-stock-info.component';
import { EditStockDepartmentComponent } from 'src/pages/stocks/edit-stocks/edit-stock-department/edit-stock-department.component';
import { EditStockImageComponent } from 'src/pages/stocks/edit-stocks/edit-stock-image/edit-stock-image.component';
import { CycleCheckComponent } from 'src/pages/cycle-check/cycle-check/cycle-check.component';
import { CycleCheckListComponent } from 'src/pages/cycle-check/cycle-check-list/cycle-check-list.component';
import { CycleCheckStepOneComponent } from 'src/pages/cycle-check/cycle-check-process/cycle-check-step-one/cycle-check-step-one.component';
import { CycleCheckRouterComponent } from 'src/pages/cycle-check/cycle-check-process/cycle-check-router/cycle-check-router.component';
import { HelpDialogComponent } from 'src/components/help-dialog/help-dialog.component';
import { PickListModule } from 'primeng/picklist';
import { InviteUsersComponent } from '../pages/users/user-invite/invite-users/invite-users.component';
import { InviteOneUserComponent } from '../pages/users/user-invite/invite-one/invite-one-user/invite-one-user.component';
import { InviteMultipleUsersComponent } from '../pages/users/user-invite/invite-multiple-users/invite-multiple-users.component';
import { InviteOneUserStepOneComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-one/invite-one-user-step-one.component';
import { InviteOneUserStepTwoComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-two/invite-one-user-step-two.component';
import { InviteOneUserStepThreeComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-three/invite-one-user-step-three.component';
import { SignupPageComponent } from '../pages/account/accounts/signup-page/signup-page.component';
import { SignupStepOneComponent } from '../pages/account/accounts/signup-page/signup-step-one/signup-step-one.component';
import { SignupStepTwoComponent } from 'src/pages/account/accounts/signup-page/signup-step-two/signup-step-two.component';
import { UsePerDialogComponent } from 'src/components/use-per-dialog/use-per-dialog.component';
import { CreateProductStepFourComponent } from 'src/pages/products/create-products/create-product-step-four/create-product-step-four.component';
import { CreateProductStepOneComponent } from 'src/pages/products/create-products/create-product-step-one/create-product-step-one.component';
import { CreateProductStepThreeComponent } from 'src/pages/products/create-products/create-product-step-three/create-product-step-three.component';
import { CreateProductStepTwoComponent } from 'src/pages/products/create-products/create-product-step-two/create-product-step-two.component';
import { EditProductComponent } from '../pages/products/edit-product/edit-product.component';
import { EditProductInformationComponent } from '../pages/products/edit-product/edit-product-information/edit-product-information.component';
import { ChangeProductPictureComponent } from '../pages/products/edit-product/change-product-picture/change-product-picture.component';
import { ReassignDunnageComponent } from 'src/pages/products/edit-product/reassign-dunnage/reassign-dunnage.component';
import { ReassignStockComponent } from 'src/pages/products/edit-product/reassign-stock/reassign-stock.component';
import { CreateProductComponent } from 'src/pages/products/create-products/create-product/create-product.component';
import { ProductListComponent } from 'src/pages/products/product-list/product-list.component';
import { ProductsComponent } from 'src/pages/products/products/products.component';
import { SubAssemblyComponent } from 'src/pages/sub-assembly/sub-assembly/sub-assembly.component';
import { SubAssemblyListComponent } from 'src/pages/sub-assembly/sub-assembly-list/sub-assembly-list.component';
import { SubAssemblyStepOneComponent } from 'src/pages/sub-assembly/sub-assembly-process/sub-assembly-step-one/sub-assembly-step-one.component';
import { SubAssemblyRouterComponent } from 'src/pages/sub-assembly/sub-assembly-process/sub-assembly-router/sub-assembly-router.component';
import { ProductionCountComponent } from '../pages/production-count/production-count/production-count.component';
import { ProductionCountListComponent } from '../pages/production-count/production-count-list/production-count-list.component';

import { ProductionCountCreateComponent } from '../pages/production-count/production-count-create/production-count-create.component';
import { ProductionCountStepOneComponent } from 'src/pages/production-count/production-count-step-one/production-count-step-one.component';
import { ProductionCountStepTwoComponent } from 'src/pages/production-count/production-count-step-two/production-count-step-two.component';
import { ForecastComponent } from '../pages/forecast/forecast/forecast.component';
import { ForecastListComponent } from 'src/pages/forecast/forecast-list/forecast-list.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountPageComponent,
    LoginPageComponent,
    DashboardComponent,
    SignoutPageComponent,
    PlantListComponent,
    CreatePlantComponent,
    FordContainerComponent,
    PlantsComponent,
    CreatePlantsDepartmentsComponent,
    CreatePlantsUsersComponent,
    CreatePlantStepOneComponent,
    CreatePlantAssignUsersComponent,
    AssignDepartmentsDialogComponent,
    CreatePlantSuccessComponent,
    LoadingIndicatorComponent,
    EditPlantPageComponent,
    DepartmentsComponent,
    DepartmentListComponent,
    CreateDepartmentComponent,
    EditDepartmentComponent,
    UsersComponent,
    UserListComponent,
    StocksComponent,
    StockListComponent,
    CreateStockComponent,
    CreateStockStepOneComponent,
    CreateStockStepTwoComponent,
    CreateStockStepThreeComponent,
    CreateStockSuccessComponent,
    InviteUsersComponent,
    InviteOneUserComponent,
    InviteMultipleUsersComponent,
    InviteOneUserStepOneComponent,
    InviteOneUserStepTwoComponent,
    InviteOneUserStepThreeComponent,
    SignupPageComponent,
    SignupStepOneComponent,
    SignupStepTwoComponent,
    ProductListComponent,
    ProductsComponent,
    CreateProductComponent,
    CreateProductStepOneComponent,
    CreateProductStepTwoComponent,
    CreateProductStepThreeComponent,
    CreateProductStepFourComponent,
    UsePerDialogComponent,
    DunnagesComponent,
    DunnageListComponent,
    CreateDunnageComponent,
    CreateDunnageStepOneComponent,
    CreateDunnageStepTwoComponent,
    CreateDunnageSuccessComponent,
    EditDunnageComponent,
    EditDunnageImageComponent,
    EditDunnageRouterComponent,
    ViewDunnageComponent,
    EditStockComponent,
    ViewStockComponent,
    EditStockInfoComponent,
    EditStockDepartmentComponent,
    EditStockImageComponent,
    EditProductComponent,
    EditProductInformationComponent,
    ReassignStockComponent,
    ReassignDunnageComponent,
    ChangeProductPictureComponent,
    CycleCheckComponent,
    CycleCheckListComponent,
    CycleCheckRouterComponent,
    CycleCheckStepOneComponent,
    HelpDialogComponent,
    SubAssemblyComponent,
    SubAssemblyListComponent,
    SubAssemblyStepOneComponent,
    SubAssemblyRouterComponent,
    ProductionCountComponent,
    ProductionCountListComponent,
    ProductionCountStepOneComponent,
    ProductionCountStepTwoComponent,
    ProductionCountCreateComponent,
    ForecastComponent,
    ForecastListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MessagesModule,
    MessageModule,
    MatFormFieldModule,
    ToastModule,
    ReactiveFormsModule,
    NgSimpleSidebarModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    NgxSpinnerModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    DataViewModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    PickListModule,

  ],
  providers: [MessageService, SharedService, SpinnerService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import {DataViewModule} from 'primeng/dataview';
import { StockListComponent } from 'src/pages/stocks/stock-list/stock-list.component';
import { StocksComponent } from 'src/pages/stocks/stocks/stocks.component';
import { CreateStockComponent } from 'src/pages/stocks/create-stocks/create-stock/create-stock.component';
import { CreateStockStepOneComponent } from 'src/pages/stocks/create-stocks/create-stock-step-one/create-stock-step-one.component';
import { CreateStockStepTwoComponent } from 'src/pages/stocks/create-stocks/create-stock-step-two/create-stock-step-two.component';
import { CreateStockStepThreeComponent } from 'src/pages/stocks/create-stocks/create-stock-step-three/create-stock-step-three.component';
import { CreateStockSuccessComponent } from 'src/pages/stocks/create-stocks/create-stock-success/create-stock-success.component';
import {MatSelectModule} from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DunnagesComponent } from 'src/pages/dunnages/dunnages/dunnages.component';
import { DunnageListComponent } from 'src/pages/dunnages/dunnage-list/dunnage-list.component';
import { CreateDunnageComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage/create-dunnage.component';
import { CreateDunnageStepOneComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-step-one/create-dunnage-step-one.component';
import { CreateDunnageStepTwoComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-step-two/create-dunnage-step-two.component';
import { CreateDunnageSuccessComponent } from 'src/pages/dunnages/create-dunnages/create-dunnage-success/create-dunnage-success.component';
import { EditDunnageComponent } from 'src/pages/dunnages/edit-dunnage/edit-dunnage.component';

import { InviteUsersComponent } from '../pages/users/user-invite/invite-users/invite-users.component';
import { InviteOneUserComponent } from '../pages/users/user-invite/invite-one/invite-one-user/invite-one-user.component';
import { InviteMultipleUsersComponent } from '../pages/users/user-invite/invite-multiple-users/invite-multiple-users.component';
import { InviteOneUserStepOneComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-one/invite-one-user-step-one.component';
import { InviteOneUserStepTwoComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-two/invite-one-user-step-two.component';
import { InviteOneUserStepThreeComponent } from '../pages/users/user-invite/invite-one/invite-one-user-step-three/invite-one-user-step-three.component';
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
    DunnagesComponent,
    DunnageListComponent,
    CreateDunnageComponent,
    CreateDunnageStepOneComponent,
    CreateDunnageStepTwoComponent,
    CreateDunnageSuccessComponent,
    EditDunnageComponent
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
    MatButtonModule
  ],
  providers: [MessageService, SharedService, SpinnerService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

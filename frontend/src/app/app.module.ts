import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountPageComponent } from '../pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from '../pages/account/accounts/login-page/login-page.component';
import { DashboardComponent } from '../pages/account/dashboard/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastModule } from 'primeng/toast';
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
import { MessageService } from 'primeng/api';
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
    LoadingIndicatorComponent
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
    NgxSpinnerModule
  ],
  providers: [MessageService, SharedService, SpinnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

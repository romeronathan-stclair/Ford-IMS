import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountPageComponent } from '../pages/account/accounts/account-page/account-page.component';
import { LoginPageComponent } from '../pages/account/accounts/login-page/login-page.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSimpleSidebarModule } from 'ng-simple-sidebar';
import { SignoutPageComponent } from '../pages/account/accounts/signout-page/signout-page.component';
import { PlantListComponent } from '../pages/plants/plant-list/plant-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    AccountPageComponent,
    LoginPageComponent,
    DashboardComponent,
    SignoutPageComponent,
    PlantListComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

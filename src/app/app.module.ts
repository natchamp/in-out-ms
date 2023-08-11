import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { MaterialModule } from './material/material.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { LibraryComponent } from './library/library.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { BookCategoriesComponent } from './book-categories/book-categories.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import {WebcamModule} from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { VisitorComponent } from './visitor/visitor.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialEntryComponent } from './material-entry/material-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    PageFooterComponent,
    SideNavComponent,
    LibraryComponent,
    RegisterComponent,
    LoginComponent,
    OrderComponent,
    OrdersComponent,
    ReturnBookComponent,
    UsersListComponent,
    ManageBooksComponent,
    BookCategoriesComponent,
    ManageCategoriesComponent,
    ProfileComponent,
    HomeComponent,
    EmployeeComponent,
    VisitorComponent,
    EmployeeListComponent,
    VisitorListComponent,
    MaterialListComponent,
    MaterialEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    WebcamModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
      tokenGetter: () => {
        return localStorage.getItem('access_token');
      },
      allowedDomains: ['localhost:7038'],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

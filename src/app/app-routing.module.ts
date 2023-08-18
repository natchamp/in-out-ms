import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication.guard';
import { LibraryComponent } from './library/library.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { VisitorComponent } from './visitor/visitor.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialEntryComponent } from './material-entry/material-entry.component';

const routes: Routes = [
  {
    path: 'books/library',
    component: LibraryComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'employee/entry',
    component: EmployeeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    //canActivate: [AuthorizationGuard],
  },
  {
    path: 'visitor/entry',
    component: VisitorComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'material/entry',
    component: MaterialEntryComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'employee/list',
    component: EmployeeListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'visitor/list',
    component: VisitorListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'material/list',
    component: MaterialListComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'users/profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

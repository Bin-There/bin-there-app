import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {VerifyEmailComponent} from "./components/verify-email/verify-email.component";
import {AuthGuard} from "./shared/guard/auth.guard";
import { TableViewComponent } from './components/table-view/table-view.component';
import { MapViewComponent } from './components/map-view/map-view.component';

const routes: Routes = [
  // Root
  { path: '', redirectTo: '/map', pathMatch: 'full' },

  // App
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'table', component: TableViewComponent },
  { path: 'map', component: MapViewComponent },

  // Auth
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

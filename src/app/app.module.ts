import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapViewComponent } from './components/map-view/map-view.component';
import { TableViewComponent } from './components/table-view/table-view.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from "./shared/services/auth.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {VerifyEmailComponent} from "./components/verify-email/verify-email.component";

import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {TrashDialogComponent} from "./components/trash-dialog/trash-dialog.component";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import { StorageService } from './shared/services/storage.service';
import {MatSortModule} from "@angular/material/sort";
import {MatStepperModule} from "@angular/material/stepper";
import {MatRadioModule} from "@angular/material/radio";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MapViewComponent,
    TableViewComponent,
    TrashDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatSortModule,
    MatStepperModule,
    MatRadioModule,
  ],
  providers: [AuthService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

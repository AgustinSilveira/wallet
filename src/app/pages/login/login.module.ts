import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    IonicModule,
    FormsModule,
  ]
})
export class LoginModule { }

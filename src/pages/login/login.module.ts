import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { ValidatorsModule } from '../../validators/validators.module';
import { AccountValidator } from '../../validators/account.validator';


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ValidatorsModule
  ],
  exports: [
    LoginPage
  ],
  providers: [ AccountValidator ]
})
export class LoginPageModule {}

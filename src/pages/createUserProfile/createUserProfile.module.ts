import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUserProfilePage } from './createUserProfile';

@NgModule({
  declarations: [
    CreateUserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUserProfilePage),
  ],
  exports: [
    CreateUserProfilePage
  ]
})
export class CreateUserProfilePageModule {}

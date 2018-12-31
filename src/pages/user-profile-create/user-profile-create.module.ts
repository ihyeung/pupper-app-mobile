import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUserProfilePage } from './user-profile-create';

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

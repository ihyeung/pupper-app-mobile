import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMatchProfilePage } from './match-profile-create';

@NgModule({
  declarations: [
    CreateMatchProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMatchProfilePage),
  ],
  exports: [
    CreateMatchProfilePage
  ]
})
export class CreateMatchProfilePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMatchProfilePage } from './createMatchProfile';

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

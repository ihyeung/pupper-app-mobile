import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMatchProfilePage } from './create-match-profile';

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

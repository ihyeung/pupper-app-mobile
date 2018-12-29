import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMainPage } from './profileMain';

@NgModule({
  declarations: [
    ProfileMainPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMainPage),
  ],
  exports: [
    ProfileMainPage
  ]
})
export class ProfileMainPageModule {}

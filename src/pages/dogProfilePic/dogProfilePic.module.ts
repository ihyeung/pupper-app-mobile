import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DogProfilePicPage } from './dogProfilePic';

@NgModule({
  declarations: [
    DogProfilePicPage,
  ],
  imports: [
    IonicPageModule.forChild(DogProfilePicPage),
  ],
  exports: [
    DogProfilePicPage
  ]
})
export class DogProfilePicPageModule {}

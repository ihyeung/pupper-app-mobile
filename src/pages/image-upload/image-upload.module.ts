import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadPage } from './image-upload';

@NgModule({
  declarations: [
    ImageUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageUploadPage),
  ],
  exports: [
    ImageUploadPage
  ]
})
export class ImageUploadPageModule {}

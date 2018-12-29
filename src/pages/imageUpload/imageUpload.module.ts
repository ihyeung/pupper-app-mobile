import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadPage } from './imageUpload';

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

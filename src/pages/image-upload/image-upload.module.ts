import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadPage } from './image-upload';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';

@NgModule({
  declarations: [
    ImageUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageUploadPage),
  ],
  exports: [
    ImageUploadPage
  ],
  providers: [
    File,
    Camera
  ]
})
export class ImageUploadPageModule {}

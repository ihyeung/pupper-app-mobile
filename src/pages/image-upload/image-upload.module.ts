import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadPage } from './image-upload';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';


@NgModule({
  declarations: [
    ImageUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageUploadPage)
  ],
  exports: [
    ImageUploadPage
  ],
  providers: [
    File,
    Camera,
    FilePath
  ]
})
export class ImageUploadPageModule {}

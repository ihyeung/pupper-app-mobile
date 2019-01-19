import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadPage } from './image-upload';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
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
    Camera,
    FileTransfer
  ]
})
export class ImageUploadPageModule {}

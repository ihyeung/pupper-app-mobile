import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUserProfilePage } from './user-profile-create';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@NgModule({
  declarations: [
    CreateUserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUserProfilePage),
  ],
  exports: [
    CreateUserProfilePage
  ],
  providers: [
    File,
    FilePath
  ]
})
export class CreateUserProfilePageModule {}

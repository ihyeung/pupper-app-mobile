import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSnapshotPage } from './profile-snapshot';
import { Dialogs } from '@ionic-native/dialogs';

@NgModule({
  declarations: [
    ProfileSnapshotPage
  ],
  imports: [
    IonicPageModule.forChild(ProfileSnapshotPage),
  ],
  exports: [
    ProfileSnapshotPage
  ],
  providers: [
    Dialogs
  ]
})
export class ProfileSnapshotPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSnapshotPage } from './profile-snapshot';

@NgModule({
  declarations: [
    ProfileSnapshotPage
  ],
  imports: [
    IonicPageModule.forChild(ProfileSnapshotPage),
  ],
  exports: [
    ProfileSnapshotPage
  ]
})
export class ProfileSnapshotPageModule {}

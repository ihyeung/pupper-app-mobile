import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfileDetailPage } from './user-profile-detail';

@NgModule({
  declarations: [
    UserProfileDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfileDetailPage),
  ],
  exports: [UserProfileDetailPage]
})
export class UserProfileDetailPageModule {}

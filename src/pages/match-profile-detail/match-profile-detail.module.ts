import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchProfileDetailPage } from './match-profile-detail';

@NgModule({
  declarations: [
    MatchProfileDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchProfileDetailPage),
  ],
})
export class MatchProfileDetailPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchingPage } from './matching';
import { SwipeCardsModule } from 'ng2-swipe-cards';

@NgModule({
  declarations: [
    MatchingPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchingPage),
    SwipeCardsModule
  ],
  exports: [
    MatchingPage
  ]
})
export class MatchingPageModule {}

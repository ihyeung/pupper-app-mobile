import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchingPage } from './matching';
import { SwipeCardsModule } from 'ng2-swipe-cards';
import { DomSanitizer } from '@angular/platform-browser';

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

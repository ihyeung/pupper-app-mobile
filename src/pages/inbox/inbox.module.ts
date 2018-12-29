import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageInboxPage } from './inbox';

@NgModule({
  declarations: [
    MessageInboxPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageInboxPage),
  ],
  exports: [
    MessageInboxPage
  ]
})
export class MessageInboxPageModule {}

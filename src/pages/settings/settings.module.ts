import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { Dialogs } from '@ionic-native/dialogs';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage)
  ],
  exports: [
    SettingsPage
  ],
  providers: [ Dialogs]
})
export class SettingsPageModule {}

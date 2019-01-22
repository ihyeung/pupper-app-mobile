import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'

})
export class TabsPage {

  tabRootProfile = 'ProfileSnapshotPage';
  tabRootSettings = 'SettingsPage';
  tabRootMatching = 'MatchingPage';
  tabRootMessaging = 'MessageInboxPage';

  constructor() {

  }

}

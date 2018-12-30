import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { environment as ENV } from '../../environments/environment';
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

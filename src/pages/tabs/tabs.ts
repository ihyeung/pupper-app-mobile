import { Component } from '@angular/core';
import { MessageInboxPage } from '../inbox/inbox';
import { MatchingPage } from '../matching/matching';
import { SettingsPage } from '../settings/settings';
import { Http } from '@angular/http';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { environment as ENV } from '../../environments/environment';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'

})
export class TabsPage {

  tabRootProfile = 'ProfileMainPage';
  tabRootSettings = 'SettingsPage';
  tabRootMatching = 'MatchingPage';
  tabRootMessaging = 'MessageInboxPage';

  constructor() {

  }

}

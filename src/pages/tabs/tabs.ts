import { Component } from '@angular/core';
import { MessageInboxPage } from '../inbox/inbox';
import { MatchingPage } from '../matching/matching';
import { SettingsPage } from '../settings/settings';
import { ProfileMainPage } from '../profileMain/profileMain';
import { Http } from '@angular/http';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { environment as ENV } from '../../environments/environment';

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs',

})
export class TabsPage {

  tabRootProfile = ProfileMainPage;
  tabRootSettings = SettingsPage;
  tabRootMatching = MatchingPage;
  tabRootMessaging = MessageInboxPage;

  constructor(public http: Http, public globalVarsProvider: GlobalVarsProvider,
    private matchProfService: MatchProfilesProvider, private utilService: UtilityProvider) {

  }

}

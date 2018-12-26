import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MatchingPage } from '../pages/matching/matching';
import { MessageInboxPage } from '../pages/inbox/inbox';
import { MessagePage } from '../pages/message/message';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { CreateMatchProfilePage } from '../pages/createMatchProfile/createMatchProfile';
import { ProfileMainPage } from '../pages/profileMain/profileMain';
import { DogProfilePicPage } from '../pages/dogProfilePic/dogProfilePic'

import { SwipeCardsModule } from 'ng2-swipe-cards';
import { HttpModule } from '@angular/http';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';

import { GlobalVarsProvider } from '../providers/globalvars/globalvars';
import { UsersProvider } from '../providers/http/userProfiles';
import { MatchProfilesProvider } from '../providers/http/matchProfiles';
import { UtilityProvider } from '../providers/utility/utilities';


@NgModule({
  declarations: [
    MyApp,
    MatchingPage,
    MessageInboxPage,
    MessagePage,
    SettingsPage,
    HomePage,
    LoginPage,
    SignupPage,
    TabsPage,
    CreateMatchProfilePage,
    DogProfilePicPage,
    ProfileMainPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    }),
    IonicStorageModule.forRoot(),
    SwipeCardsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MatchingPage,
    MessageInboxPage,
    MessagePage,
    SettingsPage,
    HomePage,
    LoginPage,
    SignupPage,
    TabsPage,
    CreateMatchProfilePage,
    DogProfilePicPage,
    ProfileMainPage
  ],
  providers: [
    File,
    Camera,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVarsProvider,
    UsersProvider,
    MatchProfilesProvider,
    UtilityProvider
  ]
})
export class AppModule {}

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MatchingPage } from '../pages/matching/matching';
import { MessagingPage } from '../pages/messaging/messaging';
import { MessagePage } from '../pages/message/message';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { CreateMatchProfilePage } from '../pages/createMatchProfile/createMatchProfile';
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
    MessagingPage,
    MessagePage,
    SettingsPage,
    HomePage,
    LoginPage,
    SignupPage,
    TabsPage,
    CreateMatchProfilePage,
    DogProfilePicPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SwipeCardsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MatchingPage,
    MessagingPage,
    MessagePage,
    SettingsPage,
    HomePage,
    LoginPage,
    SignupPage,
    TabsPage,
    CreateMatchProfilePage,
    DogProfilePicPage
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

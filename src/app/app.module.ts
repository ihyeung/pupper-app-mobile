import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { SwipeCardsModule } from 'ng2-swipe-cards';
import { HttpModule } from '@angular/http';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';

import { GlobalVarsProvider } from '../providers/globalvars/globalvars';
import { UsersProvider } from '../providers/http/userProfiles';
import { MatchProfilesProvider } from '../providers/http/matchProfiles';
import { MatchesProvider } from '../providers/http/matches';
import { MessagesProvider } from '../providers/http/messages';
import { UtilityProvider } from '../providers/utility/utilities';

import { ProfileValidator } from '../validators/profile';
import { AccountValidator } from '../validators/account';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot(),
    SwipeCardsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent
  ],
  providers: [
    File,
    Camera,
    FilePath,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVarsProvider,
    UsersProvider,
    MatchProfilesProvider,
    UtilityProvider,
    AccountValidator,
    ProfileValidator,
    MatchesProvider,
    MessagesProvider
  ]
})
export class AppModule {}

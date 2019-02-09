import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProfileDetailPage } from '../pages/user-profile-detail/user-profile-detail';

import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Utilities, Messages, Matches, MatchProfiles, Users, StorageUtilities } from '../providers';
import { ValidatorsModule } from '../validators/validators.module';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot(),
    ValidatorsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    UserProfileDetailPage
  ],
  providers: [
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Users,
    MatchProfiles,
    Utilities,
    Matches,
    Messages,
    StorageUtilities,
    FileTransfer
  ]
})
export class AppModule {}

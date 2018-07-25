import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//HTTP
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

//COMPONENTES
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//SERVICIOS
import { AuthProvider } from '../providers/auth/auth';
import { GameProvider } from '../providers/game/game';


export const firebaseConfig = {
  apiKey: "AIzaSyDV__uuqeNYIg1f-Y8C4ZxsugykSmCmzRQ",
  authDomain: "thesportchallenge.firebaseapp.com",
  databaseURL: "https://thesportchallenge.firebaseio.com",
  projectId: "thesportchallenge",
  storageBucket: "thesportchallenge.appspot.com",
  messagingSenderId: "400889993047"

};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //FIREBASE
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    //FIREBASE
    AngularFireDatabase,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GameProvider
  ]
})
export class AppModule {}

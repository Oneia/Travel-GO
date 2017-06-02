import { NgModule,
         ErrorHandler }      from '@angular/core';
import { BrowserModule }     from '@angular/platform-browser';
import { IonicApp,
         IonicModule,
         IonicErrorHandler } from 'ionic-angular';
import { TruncateModule }    from 'ng2-truncate';
import { StatusBar }         from '@ionic-native/status-bar';
import { SplashScreen }      from '@ionic-native/splash-screen';
import { SocialSharing }     from '@ionic-native/social-sharing';
import { Diagnostic }        from '@ionic-native/diagnostic';
import { Geolocation }       from '@ionic-native/geolocation';
import { GoogleMaps }        from '@ionic-native/google-maps';
import { LaunchNavigator }   from '@ionic-native/launch-navigator';
// Components
import { MyApp }           from './app.component';
import { MapPage }         from '../pages/map/map';
import { PlacesListPage }  from '../pages/places-list/places-list';
import { PlacesItemPage }  from '../pages/places-item/places-item';
import { MarkerModalPage } from '../pages/marker-modal/marker-modal';
import { InfoPage }        from '../pages/info/info';
import { TabsPage }        from '../pages/tabs/tabs';

// Services
import { PlacesService }    from '../services/places/places.service';
import { ShareDataService } from '../services/share/shareData.service';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    PlacesListPage,
    PlacesItemPage,
    MarkerModalPage,
    TabsPage,
    InfoPage
  ],
  imports: [
    BrowserModule,
    TruncateModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    PlacesListPage,
    PlacesItemPage,
    MarkerModalPage,
    InfoPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    PlacesService,
    ShareDataService,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Diagnostic,
    Geolocation,
    GoogleMaps,
    LaunchNavigator
  ]
})
export class AppModule {}

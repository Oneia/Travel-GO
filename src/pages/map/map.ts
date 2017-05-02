import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  ModalController,
  NavParams,
  AlertController
} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Diagnostic }           from '@ionic-native/diagnostic';
import { Geolocation }          from '@ionic-native/geolocation';
import { Observable }           from 'rxjs';
// Components
import { MarkerModalPage }      from '../marker-modal/marker-modal';
import { PlacesItemPage }       from '../places-item/places-item';
// Services
import { PlacesService }        from '../../services/places/places.service';
import { ShareDataService }     from '../../services/share/shareData.service';
// Constants
import * as ShareDataConstans   from '../../services/share/shareData.constants';
import * as UtilsConstants      from '../../services/utils.constants';
import * as MapConstants        from './map.constants';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [GoogleMaps, Diagnostic, Geolocation]
})
export class MapPage implements OnDestroy {

  private map: any;
  private marker: any;
  private myPosition: any;
  private places: any[];
  private watch: any;

  constructor(public navCtrl: NavController,
              private placesService: PlacesService,
              public alertCtrl: AlertController,
              private googleMaps: GoogleMaps,
              private shareDataService: ShareDataService,
              private diagnostic: Diagnostic,
              private geolocation: Geolocation,
              private params: NavParams,
              public modal: ModalController) {
    this.places = this.placesService.getPlaces();
  }

  /**
   * @inheritDoc
   */
  ionViewDidLoad() {
    this.diagnostic.isLocationAvailable()
      .then(res => {
        if (res) {
          this.loadMap();
        }
      });
    this.shareDataService.trySubject(ShareDataConstans.STREAM_SET_MARKER_CENTER)
      .subscribe(data => {
        this.setPosition(data.lat, data.lng);
      });
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy() {
    this.shareDataService.emitValue(ShareDataConstans.STREAM_UPDATE_PLACES, this.places);
  }

  /**
   * Load native map
   */
  private loadMap() {

    const location: LatLng = new LatLng(this.places[this.places.length-1].lat, this.places[this.places.length-1].lng);
    const mapOption = {
      'controls': {
        'myLocationButton': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
      // 'styles': mapStyle
    };
    const hours = new Date().getHours();
    if (hours < 6 || hours > 19) {
      mapOption['styles'] = MapConstants.mapStyle;
    }
    this.map = this.googleMaps.create('map', mapOption);
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      this.places.forEach(el => {
        this.createNewMarker(el);
      });
    });
    this.map.on(GoogleMapsEvent.CAMERA_CHANGE)
      .subscribe(() => {
        this.detectPosition();
      })
  }

  /**
   * Listener  own position
   */
  private detectPosition() {
    this.map.getMyLocation()
      .then((data: any) => {
        this.myPosition = {
          lat: data.latLng.lat,
          lng: data.latLng.lng
        };
        this.places.forEach(el => {
          const distance: number = this.placesService.getDistanceBetweenPoints(this.myPosition, {
            lat: el.lat,
            lng: el.lng
          });
          el.distance = distance;
          if (distance <= 100 && !el.circle && !el.status) {
            this.map.addCircle({
              'center': new LatLng(el.lat, el.lng),
              'radius': 100,
              'strokeColor': '#AA00FF',
              'strokeWidth': 5,
              'fillColor': '#880000'
            })
              .then((circle) => {
                el.circle = circle;
              });
            this.setPosition(el.lat, el.lng);
            this.showConfirm(el);
          } else {
            if (distance > 100 && el.circle && el.circle.remove) {
              el.circle.remove();
              el.circle = null;
            }
          }
        });
      });
  }

  /**
   *
   * Create marker
   *
   * @param place
   */
  private createNewMarker(place) {
    const position = new LatLng(place.lat, place.lng);
    const icon: string = place.status ? 'violet' : 'green';

    const markerOptions: MarkerOptions = {
      position,
      title: place.title,
      icon
    };

    this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        this.places.forEach(el => {
          if (el.title === place.title) {
            el.marker = marker;
          }
        });
        marker.addEventListener(GoogleMapsEvent.MARKER_CLICK)
          .subscribe(() => {
            this.map.setClickable(false);
            const sendingPlace = this.places.find(el => {
              return el.title === place.title;
            });
            const modal = this.modal.create(MarkerModalPage, {sendingPlace});
            modal.present();
            modal.onDidDismiss((res: boolean) => {
              if (res) {
                this.navCtrl.push(PlacesItemPage, {item: place});
              }
              this.map.setClickable(true);
            });
          });
      });
  }

  /**
   *
   * Set camera position
   *
   * @param lat
   * @param lng
   */
  private setPosition(lat: number, lng: number) {
    const location = new LatLng(lat, lng);
    this.map.animateCamera({
      'target': location,
      'tilt': 60,
      'zoom': 16,
      'bearing': 140,
      'duration': 3000
    });
  }

  /**
   *
   * show confirm for activate place
   *
   * @param place
   */
  private showConfirm(place) {
    this.map.setClickable(false);
    const confirm = this.alertCtrl.create({
      title: 'Поздравляем!',
      message: `Вы можете активировать ${place.title}!`,
      buttons: [
        {
          text: 'Позже',
          handler: () => {
            this.map.setClickable(true);
          }
        },
        {
          text: 'Активировать',
          handler: () => {
            this.map.setClickable(true);
            this.setProgress(place);
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   *
   * Set places's progress
   *
   * @param feature
   */
  private setProgress(feature) {
    this.places.forEach(el => {
      if (el.title === feature.title) {
        el.status = true;
        el.marker.setIcon('violet');
      }
    });
    this.setLocalStoragePlaces(this.places);
    this.shareDataService.emitValue(ShareDataConstans.STREAM_UPDATE_PLACES, this.places);
  }

  /**
   *
   * Set progress at localStorage
   *
   * @param res
   */
  private setLocalStoragePlaces(res) {
    localStorage.setItem(UtilsConstants.LOCAL_PLACES, JSON.stringify(res));
  }
}


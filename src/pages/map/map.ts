import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  ModalController,
  Platform,
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
// Components
import { MarkerModalPage }      from '../marker-modal/marker-modal';
import { PlacesItemPage }       from '../places-item/places-item';
// Services
import { PlacesService }        from '../../services/places/places.service';
import { ShareDataService }     from '../../services/share/shareData.service';
// Models
import PlaceModel               from '../../models/place.interface';
import ILatLng                  from '../../models/latLng.interface';
// Constants
import * as ShareDataConstants  from '../../services/share/shareData.constants';
import * as UtilsConstants      from '../../services/utils.constants';
import * as MapConstants        from './map.constants';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage implements OnDestroy {

  private map: any;
  private myPosition: ILatLng;
  private places: PlaceModel[];
  private markerWH: Object = {
    width: 30,
    height: 30
  };

  constructor(private navCtrl:          NavController,
              private placesService:    PlacesService,
              private alertCtrl:        AlertController,
              private googleMaps:       GoogleMaps,
              private shareDataService: ShareDataService,
              private diagnostic:       Diagnostic,
              private platform:         Platform,
              private modal:            ModalController) {

  }

  /**
   * @inheritDoc
   */
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.places = this.placesService.getPlaces();
      this.diagnostic.isLocationAvailable()
        .then(res => {
          if (res) {
            this.loadMap();
          }
        });
      this.shareDataService.trySubject(ShareDataConstants.STREAM_SET_MARKER_CENTER)
        .subscribe((data: ILatLng) => {
          this.setPosition(data.lat, data.lng);
        });
    });
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy() {
    this.shareDataService.emitValue(ShareDataConstants.STREAM_UPDATE_PLACES, this.places);
  }

  /**
   * Load native map
   */
  private loadMap(): void {

    const location: LatLng = new LatLng(this.places[this.places.length-1].lat, this.places[this.places.length-1].lng);
    const mapOption: any = {
      controls: {
        myLocationButton: true,
        compassButton: false
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true,
      },
      camera: {
        latLng: location,
        tilt: 30,
        zoom: 15,
        bearing: 50
      },
      // mapType: GoogleMapsMapTypeId.HYBRID,
      // styles: MapConstants.mapStyleSilver
    };
    const hours: number = new Date().getHours();
    if (hours < 6 || hours > 19) {
      mapOption.styles = MapConstants.mapStyleNight;
    }
    this.map = this.googleMaps.create('map', mapOption);

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe((e) => {
      this.places.forEach((el: PlaceModel) => {
        this.createNewMarker(el);
      });
    });
    this.map.on(GoogleMapsEvent.CAMERA_CHANGE)
      .subscribe((el) => {
        this.detectPosition();
        console.log(el.zoom);
        if (this.places[0].marker instanceof Marker) {
          if (el.zoom > 14) {
            console.log('here')

            this.places.forEach(place => {
              // console.log(place.marker.showInfoWindow)
              // if (place.marker.showInfoWindow() instanceof Function) {
              //   place.marker.showInfoWindow();
              // }
            });
          } else {
            console.log('less')
            this.places.forEach(place => {
              // console.log(place.marker.showInfoWindow)
              // if (place.marker.showInfoWindow() instanceof Function) {
              //   place.marker.hideInfoWindow();
              // }
            });
          }
        }
      })
  }

  /**
   * Listener  own position
   */
  private detectPosition(): void {
    this.map.getMyLocation()
      .then((data: any) => {
        this.myPosition = {
          lat: data.latLng.lat,
          lng: data.latLng.lng
        };
        this.places.forEach((el: PlaceModel) => {
          const distance: number = this.placesService.getDistanceBetweenPoints(this.myPosition, {
            lat: el.lat,
            lng: el.lng
          });
          el.distance = distance;
          console.log(distance);
          console.log(el)
          if (distance <= 150 && !el.circle && !el.status) {
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
  private createNewMarker(place: PlaceModel): void {
    const position: LatLng = new LatLng(place.lat, place.lng);

    const markerOptions: MarkerOptions = {
      position,
      title: place.title,
      icon: {
        url: place.status ? MapConstants.MARKER_GREEN : MapConstants.MARKER_BLACK,
        size: this.markerWH
      }
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
              marker.hideInfoWindow();
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
  private setPosition(lat: number, lng: number): void {
    const location: LatLng = new LatLng(lat, lng);
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
  private showConfirm(place: PlaceModel): void {
    this.map.setClickable(false);
    console.log('confirm');
    place.status = true;
    place.marker.setIcon({
      url: MapConstants.MARKER_GREEN,
      size: this.markerWH
    });
    const confirm = this.alertCtrl.create({
      title: 'Congratulation!',
      message: `You can activate the ${place.title}!`,
      buttons: [
        {
          text: 'Later...',
          handler: () => {
            this.map.setClickable(true);
          }
        },
        {
          text: 'Just do it!',
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
  private setProgress(feature: PlaceModel): void {
    this.places.forEach((el: PlaceModel) => {
      if (el.title === feature.title) {
        el.status = true;
        el.marker.setIcon({
          url: MapConstants.MARKER_GREEN,
          size: this.markerWH
        });
      }
    });
    this.setLocalStoragePlaces(this.places);
    this.shareDataService.emitValue(ShareDataConstants.STREAM_UPDATE_PLACES, this.places);
  }

  /**
   *
   * Set progress at localStorage
   *
   * @param res
   */
  private setLocalStoragePlaces(res): void {
    localStorage.setItem(UtilsConstants.LOCAL_PLACES, JSON.stringify(res));
  }
}


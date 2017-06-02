import { Component }     from '@angular/core';
import { NavParams,
         NavController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing'
// Services
import { ShareDataService } from '../../services/share/shareData.service';
import { PlacesService }    from '../../services/places/places.service';
// Models
import PlaceModel  from '../../models/place.interface';
import ILatLng     from '../../models/latLng.interface';
// Constants
import * as ShareDataConstants   from '../../services/share/shareData.constants';
import * as PlacesItemConstants  from './places-item.constants';

@Component({
  selector: 'page-places-item',
  templateUrl: 'places-item.html'
})
export class PlacesItemPage {

  private item: any;
  private placesList: PlaceModel[];
  private indexCurrentItem: number;

  constructor(private navParams:        NavParams,
              private navCtrl:          NavController,
              private shareDataService: ShareDataService,
              private placesService:    PlacesService,
              private socialSharing:    SocialSharing) {

    this.item = navParams.get('item');
  }

  /**
   * @inheritDoc
   */
  ionViewDidLoad() {
    this.placesList = this.placesService.getPlaces();
    this.indexCurrentItem = this.placesList.findIndex((el: PlaceModel) => el.title === this.item.title);
  }

  /**
   *
   * Change content by swipe
   *
   * @param event - swipe event (left\right)
   */
  private swipeElement(event: any): void {
     switch(event.direction) {
       case PlacesItemConstants.SWIPE_DIRECTION_LEFT:
         this.navCtrl.push(PlacesItemPage,
           {item: this.getNextElement(PlacesItemConstants.SWIPE_DIRECTION_LEFT)});
         break;
       case PlacesItemConstants.SWIPE_DIRECTION_RIGHT:
         this.navCtrl.push(PlacesItemPage,
           {item: this.getNextElement(PlacesItemConstants.SWIPE_DIRECTION_RIGHT)});
         break;
     }
  }

  /**
   *
   * Get next or previous element
   *
   * @param direction - type of swipe
   *
   * @return {PlaceModel}
   */
  private getNextElement(direction: number): PlaceModel {
    if (direction === PlacesItemConstants.SWIPE_DIRECTION_LEFT) {
      if (this.placesList[this.indexCurrentItem - 1]) {
        return this.placesList[this.indexCurrentItem - 1];
      } else {
        return this.placesList[this.placesList.length - 1];
      }
    } else {
      if (this.placesList[this.indexCurrentItem + 1]) {
        return this.placesList[this.indexCurrentItem + 1];
      } else {
        return this.placesList[0];
      }
    }
  }

  /**
   * Share at facebook
   */
  private shareFacebook(file: HTMLImageElement): void {
    this.socialSharing.shareViaFacebook(`I have visited ${this.item.title}.`, this.getBase64Image(file), '')
      .then((res) => {
        alert('success');
      });
  }

  /**
   *
   * Navigate to current item at map
   *
   * @param lat
   * @param lng
   */
  private goToItemAtMap(lat: number, lng: number): void {
    const data: ILatLng = {
      lat,
      lng
    };
    this.shareDataService.emitValue(ShareDataConstants.STREAM_SET_MARKER_CENTER, data);
    this.navCtrl.parent.select(0);
  }

  /**
   *
   * Recode the image ot base64 element
   *
   * @param img - img element
   * @return {string}
   */
  private getBase64Image(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  /**
   *
   * Open a google navigate launcher
   *
   */
  private goToGoogleNavigate(): void {
    this.placesService.googleNavigate(this.item.lat, this.item.lng);
  }
}

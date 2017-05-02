import {Component} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
// Services
import {ShareDataService} from '../../services/share/shareData.service';
// Constants
import * as ShareDataConstans from '../../services/share/shareData.constants';

@Component({
  selector: 'page-places-item',
  templateUrl: 'places-item.html'
})
export class PlacesItemPage {

  private item: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public shareDataService: ShareDataService,
              public socialSharing: SocialSharing) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {

  }

  /**
   * Share at facebook
   */
  public shareFacebook(file) {
    this.socialSharing.shareViaFacebook(`I have visited ${this.item.title}.`, this.getBase64Image(file), '')
      .then((res) => {
        alert('success');
      });
  }

  public goToItemAtMap(lat, lng) {
    const data = {
      lat,
      lng
    };
    this.shareDataService.emitValue(ShareDataConstans.STREAM_SET_MARKER_CENTER, data);
    this.navCtrl.parent.select(0);
  }

  public getBase64Image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
}

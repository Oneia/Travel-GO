import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


// Services
import { PlacesService }    from '../../services/places/places.service';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  constructor(private socialSharing: SocialSharing,
              private placesService: PlacesService,) {

  }

  /**
   *
   * get progress
   *
   * @return {number}
   */
  private getProgress() {
    // return this.placesService.getProgress();
  }

  public shareFacebook(): void {

    // this.socialSharing.shareViaFacebook(`I am playing Odessa GO and I already visited ${this.getProgress().resolved} of ${this.getProgress().full}`, img, 'http://fancy-dev.in.ua')
    //   .then((res) => {
    //     console.log(res)
    //   })
  }

  public clearLocalStorage() {
    localStorage.clear();
  }
}

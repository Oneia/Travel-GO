import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// Components
import { PlacesItemPage } from '../places-item/places-item';
// Services
import { PlacesService } from '../../services/places/places.service';
import { ShareDataService } from '../../services/share/shareData.service';
// Constants
import * as ShareDataConstans from '../../services/share/shareData.constants';

@Component({
  selector: 'page-places-list',
  templateUrl: 'places-list.html'
})
export class PlacesListPage {

  private placesList;
  private placesListInitial;

  constructor(public navCtrl: NavController,
              public shareDataService: ShareDataService,
              public placesService: PlacesService
  ) {
    this.placesListInitial = placesService.getPlaces();
    this.placesList = this.placesListInitial;
  }

  ionViewDidLoad() {

  }

  /**
   *
   * Navigate to item page
   *
   * @param item
   */
  public goToDetails(item: any) {
    this.navCtrl.push(PlacesItemPage, {item});
  }

  public searchPlace(event: any) {
    this.placesList = this.placesListInitial;
    let searchValue = event.target.value;

    if (!searchValue || searchValue.trim() === '') {
      return;
    }

    this.placesList = this.placesList.filter((country) => {
      return country.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
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
}

import { Component }        from '@angular/core';
import { NavController }    from 'ionic-angular';
// Components
import { PlacesItemPage }   from '../places-item/places-item';
// Services
import { PlacesService }    from '../../services/places/places.service';
import { ShareDataService } from '../../services/share/shareData.service';
// Models
import PlaceModel           from '../../models/place.interface';
import ILatLng              from '../../models/latLng.interface';
// Constants
import * as ShareDataConstants from '../../services/share/shareData.constants';

@Component({
  selector: 'page-places-list',
  templateUrl: 'places-list.html'
})
export class PlacesListPage {

  private placesList:        PlaceModel[];
  private placesListInitial: PlaceModel[];

  constructor(public navCtrl:          NavController,
              public shareDataService: ShareDataService,
              public placesService:    PlacesService
  ) {
    this.placesListInitial = placesService.getPlaces();
    this.placesList = this.placesListInitial;
  }

  /**
   *
   * Navigate to the item page
   *
   * @param item
   */
  public goToDetails(item: PlaceModel): void {
    this.navCtrl.push(PlacesItemPage, {item});
  }

  /**
   *
   * Search place box
   *
   * @param event
   */
  public searchPlace(event: any): void {
    this.placesList = this.placesListInitial;
    let searchValue = event.target.value;

    if (!searchValue || searchValue.trim() === '') {
      return;
    }

    this.placesList = this.placesList.filter((place: PlaceModel) => {
      return place.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });
  }

  /**
   *
   * Navigate to the place at map
   *
   * @param lat
   * @param lng
   */
  public goToItemAtMap(lat: number, lng: number): void {
    const data: ILatLng = {
      lat,
      lng
    };
    this.shareDataService.emitValue(ShareDataConstants.STREAM_SET_MARKER_CENTER, data);
    this.navCtrl.parent.select(0);
  }
}

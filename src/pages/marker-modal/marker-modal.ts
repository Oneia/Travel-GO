import { Component,
         Renderer2  }      from '@angular/core';
import { ViewController,
         NavParams }       from 'ionic-angular'
// Services
import { PlacesService }   from '../../services/places/places.service';
// Models
import PlaceModel          from '../../models/place.interface';


@Component({
  selector: 'page-marker-modal',
  templateUrl: 'marker-modal.html'
})

export class MarkerModalPage {

  private markerData: PlaceModel;

  constructor(private view:            ViewController,
              private renderer:        Renderer2,
              private placesService:   PlacesService,
              private params:          NavParams) {
    this.renderer.addClass(view.pageRef().nativeElement, 'my-popup');
    this.markerData = params.get('sendingPlace');
    }

  /**
   *
   * Navigate to item page
   *
   */
  private readMore(): void {
    this.view.dismiss(true);
  }

  /**
   *
   * Open a google navigate launcher
   *
   */
  private goToGoogleNavigate(): void {
    this.placesService.googleNavigate(this.markerData.lat, this.markerData.lng);
  }
}

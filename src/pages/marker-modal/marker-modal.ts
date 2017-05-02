import { Component, Renderer2  } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-marker-modal',
  templateUrl: 'marker-modal.html'
})
export class MarkerModalPage {

  private markerData: any;

  constructor(private view: ViewController,
              public renderer: Renderer2,
              private params: NavParams) {
    this.renderer.addClass(view.pageRef().nativeElement, 'my-popup');
    this.markerData = params.get('sendingPlace');
    }

  /**
   *
   * Navigate to item page
   *
   */
  public readMore(): void {
      this.view.dismiss(true);
    }

  /**
   * Close current popup
   */
  public cansel(): void {
        this.view.dismiss(false);
    }

}

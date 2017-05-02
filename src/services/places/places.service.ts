import {Injectable} from '@angular/core';
import { ShareDataService } from '../share/shareData.service';
// Constants
import * as LocationsConstants from './Geolocation.objects.constants';
import * as ShareDataConstants from '../share/shareData.constants';
import * as UtilsConstants from '../utils.constants';


@Injectable()
export class PlacesService {

	private places: any[] =  Object.keys(LocationsConstants).map(key => LocationsConstants[key]);

	constructor(
	  private shareDataService: ShareDataService
  ){}

  /**
   *
   * Load places from localstorage or base
   *
   * @return {any[]}
   */
	public getPlaces(): any[]{
    this.places = localStorage.getItem(UtilsConstants.LOCAL_PLACES) ?
      JSON.parse(localStorage.getItem(UtilsConstants.LOCAL_PLACES)) :
      Object.keys(LocationsConstants).map(key => LocationsConstants[key]);
    this.shareDataService.trySubject(ShareDataConstants.STREAM_UPDATE_PLACES)
      .subscribe(data => {
        this.places = data;
      });
    return this.places;
	}

  /**
   *
   * Calculate percent checked place of full
   *
   * @param arr
   * @return {number}
   */
  public getProgress() {
    const visited = this.places.filter(el => el.status === true);
    return {
      percent: Math.round(visited.length / this.places.length * 100),
      resolved: visited.length,
      full: this.places.length
    };
  }

  public getDistanceBetweenPoints(start: any, end: any): number {
    const earthRadius: any = {
      miles: 3958.8,
      km: 6371
    };

    const R: number = earthRadius.miles;
    const lat1: number = start.lat;
    const lon1: number = start.lng;
    const lat2: number = end.lat;
    const lon2: number = end.lng;

    const dLat: number = this.toRad((lat2 - lat1));
    const dLon: number = this.toRad((lon2 - lon1));
    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const range: number = R * c;

    return Math.round(range*1000);

  }

  /**
   *
   * Calculate lat/lng to radian
   *
   * @param x
   * @return {number}
   */
  private toRad(x: number): number {
    return x * Math.PI / 180;
  }
}

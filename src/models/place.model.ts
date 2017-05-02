import DescriptionPlaceModel from './description-place.model';

export interface PlaceModel {
	lat: number;
	lng: number;
	img: string[];
	desc?: any[];
}
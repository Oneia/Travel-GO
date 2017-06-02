export interface PlaceModel {
	lat: number;
	lng: number;
	title: string;
	img: string;
	description: string;
	content: string;
	marker?: any;
	distance?: number;
	status?: boolean;
	circle?: any;
}
export default PlaceModel
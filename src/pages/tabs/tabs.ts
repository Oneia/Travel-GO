import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { PlacesListPage } from '../places-list/places-list';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = MapPage;
  tab2Root = PlacesListPage;
}

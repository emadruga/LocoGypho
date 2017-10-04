import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  perPage: number;
  sort: string;
  giphyQuery: string;

  constructor(public view: ViewController, public navParams: NavParams) {

    this.perPage = this.navParams.get('perPage');
    this.sort = this.navParams.get('sort');
    this.giphyQuery = this.navParams.get('giphyQuery');
    
  }

  save(): void {

  	let settings = {
  		perPage: this.perPage,
  		sort: this.sort,
  		giphyQuery: this.giphyQuery
  	};

  	this.view.dismiss(settings);
  }

  close(): void {
  	this.view.dismiss();
  }
}

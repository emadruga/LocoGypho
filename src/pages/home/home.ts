import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { DataProvider } from '../../providers/data/data';
import { GiphyProvider } from '../../providers/giphy/giphy';
import { FormControl } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    giphyQueryValue: string;  
    giphyQueryControl: FormControl;

    constructor(public dataService: DataProvider, public giphyService: GiphyProvider, 
		public modalCtrl: ModalController, public platform: Platform, 
		public keyboard: Keyboard, public iab: InAppBrowser) {

	this.giphyQueryControl = new FormControl();

    }

    ionViewDidLoad(){

	this.giphyQueryControl.valueChanges.debounceTime(1500)
	    .distinctUntilChanged().subscribe(giphyQuery => {

		if(giphyQuery != '' && giphyQuery){
		    this.giphyService.query = giphyQuery;
		    this.changeGiphyQuery();
		    this.keyboard.close();
		}
		
	    });


	this.platform.ready().then(() => {

	    this.loadSettings();
	    
	});
	
    }

    loadSettings(): void {
	this.dataService.getData().then((settings) => {

	    if(settings && typeof(settings) != "undefined"){

		let newSettings = JSON.parse(settings);
		this.giphyService.settings = newSettings;

		if(newSettings.length != 0){
		    this.giphyService.sort = newSettings.sort;
		    this.giphyService.perPage = newSettings.perPage;
		    this.giphyService.query = newSettings.giphyQuery;
		}   

	    }

	    this.changeGiphyQuery();

	});

    }

    showComments(post): void {
	console.log("TODO:  showComments()");
	let browser = this.iab.create(post.permalink);
    }

    openSettings(): void {

	let settingsModal = this.modalCtrl.create('SettingsPage', {
	    perPage: this.giphyService.perPage,
	    sort: this.giphyService.sort,
	    giphyQuery: this.giphyService.query
	});
	
	settingsModal.onDidDismiss(settings => {

	    if(settings){
		this.giphyService.perPage = settings.perPage;
		this.giphyService.sort = settings.sort;
		this.giphyService.query = settings.giphyQuery;

		this.dataService.save(settings); 
		this.changeGiphyQuery();      
	    }

	});

	settingsModal.present();

    }

    playVideo(e, post): void {
	console.log("TODO: playVideo()");

	//Create a reference to the video
	let video = e.target;

	if(!post.alreadyLoaded){
	    post.showLoader = true;     
	}

	//Toggle the video playing
	if(video.paused){

	    //Show the loader gif
	    video.play();

	    //Once the video starts playing, remove the loader gif
	    video.addEventListener("playing", (e) => {
		post.showLoader = false;
		post.alreadyLoaded = true;
	    });

	} else {
	    video.pause();
	}
	


    }

    shuffleGiphyQuery(): void {

	var favorites = ["naughty", "hate", "wink", "sad"];
	var giphyQuery = favorites[Math.floor(Math.random() * favorites.length)];
	var msg = "GiphyQuery is " + giphyQuery;
	console.log(msg);
	this.giphyService.query = giphyQuery;
	this.changeGiphyQuery();
    }

    changeGiphyQuery(): void {
	console.log("TODO: changeGiphyQuery()");
	this.giphyService.resetPosts();
    }

    loadMore(): void {
	console.log("TODO: loadMore()");
	this.giphyService.nextPage();
    }

}


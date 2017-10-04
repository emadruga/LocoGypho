import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GiphyProvider {

    settings: any;
    loading: boolean = false;
    posts: any = [];
    query: string = 'happy';
    page: number = 1;
    perPage: number = 15;
    myAPI_key = 'mX5hQKOb0eqFCJtCKY4I0SSAGPsceoXV'
    offset: number = 0;
    stopIndex: number;
    sort: string = 'hot';
    responseCount: number = 0;
    count: number = 0; 
    moreCount: number = 0;

    constructor(public http: Http) {

    }

    fetchData(): void {

	let query_str =  this.query.replace(/\s+/g,'+');

	//Build the URL that will be used to access the API based on the users current preferences
	let url = 'https://api.giphy.com/v1/gifs/search?api_key=' + this.myAPI_key + '&q=' + query_str + '&limit='
	    + this.perPage + '&offset=' + this.offset + '&rating=G&lang=en'

	console.log('URL is: ' + url);

	//We are now currently fetching data, so set the loading variable to true
	this.loading = true;

	//Make a Http request to the URL and subscribe to the response
	this.http.get(url).map(res => res.json()).subscribe(data => {

	    let stopIndex = this.posts.length;
	    this.posts = this.posts.concat(data.data);
	    this.responseCount = data.pagination.total_count;
	    this.count = data.pagination.count;

	    console.log(data);

	    //Loop through all NEW posts that have been added. 
	    for(let i = this.posts.length - 1; i >= stopIndex; i--){

		let post = this.posts[i];

		//Add a new property that will later be used to toggle a loading animation
		//for individual posts
		post.showLoader = false;
		post.alreadyLoaded = false;

		// console.log(post);
		// if ('mp4' in post.images.looping) {
		//     console.log("Found mp4");
		// } else {
		//     console.log("Not found mp4");
		// }
		    
		this.posts[i].url = post.images.looping.mp4;
		this.posts[i].permalink = post.bitly_gif_url;
		this.posts[i].snapshot = post.images["480w_still"].url;

		if( 'source_tld' in post && post.source_tld != ""){
		    this.posts[i].title    = post.source_tld;
		} else {
		    this.posts[i].title    = post.id;
		}
		this.loading = false;

	    }


	}, (err) => {
	    //Fail silently, in this case the loading spinner will cease to display
	    console.log("query doesn't exist!");
	    this.loading = false;
	});
    }

    nextPage(){

	if(this.responseCount < (this.perPage * (this.page+1) ) || this.moreCount > 3){

	    this.moreCount = 0;
	    this.loading = false;
	    this.resetPosts();

	} else {
	    this.page++;
	    this.offset += this.count;
	    this.fetchData();
	    this.moreCount++;
	} 

    }

    resetPosts(){
	this.page = 1;
	this.posts = [];
	this.offset = 0;
	this.responseCount = 0;
	this.count = 0;
	this.fetchData();
    }

}


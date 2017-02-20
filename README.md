# frequent-flyer-flights
Send multiple request and check availability dates for frequent flyer program

Learning to code started as a curiosity about how things around me worked.  I was using computers for most of my adult life, using apps, desktop apps (that we called “programs”), and had only little clue about how things really worked.  This was making me crazy.  Bringing back lessons of my early years when I used to program in [Logo](https://en.wikipedia.org/wiki/Logo_(programming_language)), I peeked into HTML, CSS and Javascript. 

As one may suspect I got  sucked into the Javascript ecosystem tornado.

I spend most of my time reading other people’s code and writing  little of my own.  I think the time spent reading the documentation and the implementation of a package or framework is better spent than making a To Do app by cloning a boilerplate. I remember doing my first app with login, encrypted password, multiple views, express as router, flash message, responsive design and hardly understanding the meaning of “this” in Javascript.  That doesn’t feel right.

Anyway, I hardly push something to Github. Basically because I think it will be useless.  After hearing [this] (https://changelog.com/podcast/237) episode  of the Changelog, where Chris Lamb said he had a script to search for bikes and he pushed to Github, I thought I would push something.

Oh man, what a confessional!!  

So, I am a member of a Frequent-flyer program called [Smiles](https://www.smiles.com.br/home). O regularly check to see if there is any good flight available. The problem you have to check availability and points per day, instead of per a certain period.  So, for you to check availability in a certain range of days you have to reload the page several times with the desired date. Oh man how that is annoying!!

Seems like a problem solvable with code. Perhaps I could  make a web crawler for various requests.

First off I ran a request with the Chrome console opened on the net tab to figure out how the it was made and what was the response. To my surprise, when looking at the XHR resources in the response, there it was a big fat juicy JSON object ready to be consumed!!!

So I had to build the request object, to be used by [request](https://github.com/request/request). The Chrome dev tools were already great at displaying headers.  But I figured out it was easier to past the cURL command and take it from there, since headers are marked with an -H flag. After I discovered a great cURL to Node converter [here] (https://curl.trillworks.com/#node).

I used [Moment](https://momentjs.com/) to make date manipulation easier. It was totally not required to be honest, but anyway I love Moment.

I set up a while loop to send multiple request for a certain range of dates.  The thing was I did not want their server to easily identify what I was doing.  I mean, of course they could see someone was sending the same headers for the same destinations...but stil, I wanted to keep it low key.  Since this was a simple, silly, little private project (it was never intended to be used other than by me) I set some global variables for the ID and cookie.  The easiest way was to…**be careful Node** users there is some sync code ahead: use [SyncRequest] (https://www.npmjs.com/package/sync-request).

The rest was just parsing the results.

*disclaimer*

This code is broken now. As a matter of fact, if it was not, I probably would not have "open sourced" it.  A few months after I wrote it I figured the company stated to server side render the page.  Perhaps a good reason to built that webcrawler after all.

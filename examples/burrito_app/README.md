BURRITO
==============

A simple car service app using the Fancy Hands API and a little Google Maps magic

## How does it work?

The app uses [node.js](http://nodejs.org) and [express](http://expressjs.com/) for the server side, and [Angular](http://angularjs.org/) to handle all front-end interactions and communication with the server. 

For mapping, we used the [Google Maps] API(https://developers.google.com/maps/documentation/javascript/)

To send the request we use the Fancy Hands [Custom Request Method](https://www.fancyhands.com/api/explorer#/explorer/fancyhands.request.Custom)

We also used [Yeoman](http://yeoman.io/) to initialize the project.

### Building the app

The easiest way to build this project is by installing [Yeoman](http://yeoman.io/), a command line utility that helps manage dependencies. Check out their site for install info. Once you're setup, you'll wanna go into the root folder of the project and run `bower install`. This will install all of the components (listed in bower.json and package.json) you need to get up and running. 

### The Server

[/web.js](https://github.com/fancyhands/fh-api/blob/master/examples/burrito_app/web.js)

All of the server-side code is contained within [web.js](https://github.com/fancyhands/fh-api/blob/master/examples/burrito_app/web.js). This is where we initialize the express framework, setup our API configuration, authenticate with OAuth, and set up our /api-call URL handler. 

You can start the server by running:
```
node web.js
```

### The Main Controller

[/scripts/controllers/main.js](https://github.com/fancyhands/fh-api/blob/master/examples/burrito_app/app/scripts/controllers/main.js)

This is where most of the tasty burrito action happens. I won't go into too much detail about how angular.js works it's magic (that would take up way too much of your time), but I'll try to explain the steps we take through the app. 

The main objective of the app is to collect information on where the user is/wants to be picked up, where they're going, and basic info about them (name and number -- so they can be contacted by the car service). Once we have this info, we can send it to the FH assistants by using the Custom Request Method.

#### Step One -- Get the Pickup Location
...



## Why burrito?

I was hungry.

 

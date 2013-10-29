BURRITO
==============

## What is it?
A simple car service app using the Fancy Hands API and a little Google Maps magic. Users set a pickup and dropoff point and send a request to the Fancy Hands Assistants, who in turn call up the nearest car company and schedule a pickup.

[See it in action at fh-burrito.herokuapp.com!](http://fh-burrito.herokuapp.com)

##### Why is it called Burrito?

Dunno, hungry at the time and liked the idea of having projects named after food.

## How does it work?

The app uses [node.js](http://nodejs.org) and [express](http://expressjs.com/) for the server side, and [Angular](http://angularjs.org/) to handle all front-end interactions and communications with the server. 

For mapping, we used the [Google Maps API](https://developers.google.com/maps/documentation/javascript/)

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

This is where most of the tasty burrito action happens. We won't go into too much detail about how angular.js works it's magic (that would take up way too much of your time), but we'll try to explain the steps we take through the app. 

The main objective of the app is to collect information on where the user is/wants to be picked up, where they're going, and basic info about them (name and number -- so they can be contacted by the car service). Once we have this info, we can send it to the FH assistants by using the Custom Request Method.

#### Step One -- Get the Pickup Location
First, we try to get the users coordinates using the native `navigator.geolocation.getCurrentPosition()`. This is compatible with almost all modern browsers and will return the users location (if they accept the 'Share location' prompt).

*NOTE -- In our case, we didn't provide a fallback (must have been overlooked, whoops). But, it would be very simple to initialize the map and have the user search their location as well.*

Once we have the lat and lng, we initialize Google Maps and pass in the coordinates to drop and pin and center the map on the user's location

#### Step Two -- Setting the Dropoff
Once pickup is confirmed, we show and focus on the 'To' search field. Here the user types in their destination. We use some GMap services to search locations, get the route, and calculate the distance once the dropoff is set.

* [Geocoding](https://developers.google.com/maps/documentation/geocoding/) -- used to search coordinates based on text searches.
* [Direction Services](https://developers.google.com/maps/documentation/directions/) -- for calculating the route and returning the distance between the two points.

#### Step Three -- Confirming the Route
Users are presented with the full map view of the route, estimated price (we based it on average NY car services per mile) and are prompted to fill out their personal info and hit the 'Send Request' button. At this point we have built up all of the information that we need to send out a request for the assistants. We have the users:
* Name
* Phone Number
* Location
* Destination

Now all we have to do is wire up the request

#### Step Four -- The Request
If you look at the docs for the [Custom Request Method](https://www.fancyhands.com/api/explorer#/explorer/fancyhands.request.Custom), you'll see there are four required params we need to pass in. They are:
``` javascript
{
    title: "name of the task", // string
    description: "what we want the assistant to perform", //string
    bid: "the amount of money you're willing to pay for the task," // integer
    expiration_date: "when the task will expire (must be within 7 days )" // ISO Date/Time
}
```

So our post function will look something like this:

``` javascript
function postRequest() {
    
    // Set main description text
    var description = 'Call a nearby car service and have them pick me up at ' + $scope.pickupLocation + ' and drop me off at ' + $scope.dropoffLocation + '.\n\n' +
    'My name: ' + $scope.contact_name + '\n' +
    'My number: ' + $scope.contact_number + '\n\n' + 
    'Thanks!';
    
    // Create expiration date and set it to 24 hours from now
    var expiration_date = new Date();
    expiration_date.setTime(expiration_date.getTime() + (24 * 60 * 60 * 1000)); 

    // Builds our the post data object with all the required fields
    var post_data = {
        _method: "POST",
        _url: API_HOST + "/api/v1/request/custom/",
        title: 'Car Pickup',
        description: description,
        bid: 4, // in dollars the amount we'll pay the assistant to pick up the task
        expiration_date: expiration_date,
    };

    // Send the request out
    $http({ 
        url: SITE_ROOT + '/api-call', 
        method: 'POST', 
        data: post_data 
    }).
    success(function(data) {
        // Show success page!
    });
}            

```
#### What Happens Next?

Now that the request is sent out, one of our assistants will pick it up and schedule the car service. We didn't build this part out, but using your webhook url, we will ping your app every time there's an update from our end. This way you can show the user the status of the task, and update them on when their car will arrive.
 
Questions, comments, feedback? Email us at api@fancyhands.com, [create an issue on github](https://github.com/fancyhands/fh-api/issues), or submit a pull request.

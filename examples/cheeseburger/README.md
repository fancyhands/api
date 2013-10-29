CHEESEBURGER
==============================================
A Chrome extension that makes popular websites better by using the Fancy Hands API
	
## What?!

Cheeseburger is yet another delicious sounding Fancy Hands API example app. At it's core, CB is a google chrome extension that provides handy Fancy Hands integrations to popular websites. This version has two integrations:
* Amazon.com -- a button is added to product pages that sends a request to check local stores for that product so you could potentially pick it up today.
* Seamless.com -- a button is added to menu items that are daily specials, letting users have an assistant call up the restaurant and, for instance, ask what's the soup of the day.  

<hr>
<h6>Amazon</h6>
![](http://i.imgur.com/5j7C4ar.png)  

<hr>
###### Seamless
![](http://i.imgur.com/51bdsJ4.png?1)   

## How does it work?

To learn about what goes into building extensions for chrome, check out their [Get Started](http://developer.chrome.com/extensions/getstarted.html) page.

The beef and fries of this app happens in [/cheeseburger.js](https://github.com/fancyhands/cheeseburger/blob/master/cheeseburger.js)
The file is fairly well documented but lets go over some of the main concepts.

### Building the Request

The objective of this app is to ultimately send out a request using the Fancyhands API. For this demonstration, we'll be using the [Custom Request Method](https://www.fancyhands.com/api/explorer#/explorer/fancyhands.request.Custom).
Looking at the documentation, you'll notice that there are 4 required fields:

``` javascript
{
    title: "name of the task", // string
    description: "what we want the assistant to perform", //string
    bid: "the amount of money you're willing to pay for the task", // integer
    expiration_date: "when the task will expire (must be within 7 days )" // ISO Date/Time
}
```

In this app, the `bid` and `expiration_date` properties stay static. The only things that change are the `title` and the `description`.


Essentially what we wanna do is:
* Check to see what site we're on
* Set the title of the request
* Set the description
* Append a button to the page
* Send the request when that button is pressed

Let's take a look at how it works...


#### Seamless

``` javascript
// SEAMLESS
// =========================================================================
if (CURRENT_SITE === "www.seamless.com") {

    /** Adds a 'fancyhands-call' class to each product that is a daily special
        * We do this by looping through all of the tooltips for each item and checking
        * for the phrase 'Please contact'
    */

    $('.customTip').each(function() {
        var $this = $(this);
                        
        // Looks for the phrase 'Please contact' which appears in every daily special
        if ($this.find('div').text().indexOf('Please contact') !== -1 ) {
            $this.parent().addClass("fancyhands-call");
        }
    });

    /** CLICK HANDLER FOR ITEM LINK
        * Checks to see that the product is loaded up in the popup, then appends FH button if needed.
        * Pulls request and number info directly from the description
          - descriptions with daily specials have a sentence in the following format:

            "Please contact Bravo Pizza at (917) 974-3533 for the Danish selection."

        * Sets a click handler on the button too. */

    $('.productFancyBox').click(function() {
        checkIfProductLoaded(function() {
            var description = $('#fancybox-content').find('.description').text();
            var start = description.indexOf('Please contact'); // Signifies the start of the daily special
            var end = description.indexOf('Enter your'); // Next sentence that ends the daily special
            
            request = description.slice(start, end)
            title = "Call restaurant for daily special";

            // Add button if its a daily special, and make sure the button doesn't already exist.
            if( start !== -1 && $('.fancyhands-btn').length === 0 ) {
                var $btn = $('<a class="fancyhands-btn" href="#">Contact restaurant with Fancy Hands</a>');

                $('#fancybox-content').find('.description').append($btn);
		
		
                // Send the Request!
                $btn.on('click', function(e) {
                    e.preventDefault();
                    sendRequestToFancyHands($(this));
                });
            }
        });
    });
    
    // Recursively checks to see if the information was loaded into the menu item popup.
    // We do this because Seamless loads up the item info async, so we gotta wait and
    // check to see that the info is loaded before starting
    
    function checkIfProductLoaded(callback) {
        if ( $('#fancybox-content').find('.description').length !== 0 ) {
            callback();
            return true;
        } else {
            setTimeout(function() { checkIfProductLoaded(callback) }, 100);
        }
    }
}
```

#### Amazon

``` javascript
// AMAZON
// ================================================================
if (CURRENT_SITE === "www.amazon.com") {
        
    var amazon_product_url = window.location.href;
    var item = "this item";

    // Gets and sets the name of the item 
    // (grabs it from different elements depending on page layout) 
    if ( $('#btAsinTitle').length !== 0 ) item = $('#btAsinTitle').text();
    if ( $('h1#title').length !== 0 ) item = $('h1#title').text();

    // Creates the request
    request = "Please check to see if " + item + " is in stock at any stores near me. Here's the link: " + amazon_product_url;

    // This will be the title of the request that our assistants see
    title = "Check inventory of local stores"

    // The element that gets appended to the page
    $fancyHandsRequestBox = $(
        '<div class="fancyhands-request-box">' +
            '<h4>Need this today?</h4>' +
            '<p>Use <strong>Fancy Hands</strong> to find out what stores in your area have this item in stock</p>' +
            '<a id="send-to-fancyhands" class="fancyhands-btn" href="#">Send Request</a>' +
        '</div>'
    )

    // Append the element 
    // (in different location depending on the specific page layout)
    if( $('.buyingDetailsGrid').length !== 0 ) {
        $('.buyingDetailsGrid').append($fancyHandsRequestBox)
    } else if ( $('#mbc').length !== 0 ) {
        $('#mbc').after($fancyHandsRequestBox);
    } else if ( $('#buybox_feature_div').length !== 0 ) {
        $('#buybox_feature_div').after($fancyHandsRequestBox);
    }

    // Click handler for the Send Request button
    // Send the Request!
    $('#send-to-fancyhands').on('click', function(e) {
        e.preventDefault();
        sendRequestToFancyHands($(this))
    });
}
```
Here we did the same thing as with Seamless:
* Set the title of the request
* Set the description
* Append a button to the page
* Send the request when that button is pressed

Now that we have our post data gathered it's time to...
 
### Send the Request!

The last function of each site's code block is a click handler that invokes this function:
``` javascript
sendRequestToFancyHands($(this));
```

`sendRequestToFancyHands(el)` takes one parameter which is the element used to invoke it. We use this to change the text of the button to reflect the state of the request.
For example:
* On success = "Request Sent!"
* On error = "Something went wrong :("


###### This is what it looks like:
``` javascript
function sendRequestToFancyHands(el) {

    // Set the button text
    el.text('Sending...');

    // Set expiration date to 24 hours from now
    var expiration_date = new Date();
    expiration_date.setTime(expiration_date.getTime() + (24 * 60 * 60 * 1000)); 
    
    // This is the data we'll be posting to the server
    var post_data = {
        title: title,
        description: request,
        bid: 2, // 2 - 3 is average for a request like this
        expiration_date: expiration_date.toISOString(),
        oauth_consumer_key: OAUTH_CONSUMER_KEY,
        oauth_timestamp: Math.round(new Date().getTime() / 1000),
        oauth_nonce: Math.random() * 10000,
        oauth_signature_method: 'HMAC-SHA1',
    };

    // Set up the OAuth signuture and add it to the post_data
    var url = API_HOST + "/api/v1/request/custom/";
    var method = "POST";
    var _sig_base = sig_base(method, url, post_data);
    var key = encodeURIComponent(OAUTH_CONSUMER_SECRET) + "&";
    post_data['oauth_signature'] = CryptoJS.HmacSHA1(_sig_base, key).toString(CryptoJS.enc.Base64);

    // Send the request!
    $.ajax({ 
        url: url,
        type: method, 
        data: post_data 
    })
    .success(function(data) {
        el.text('Request Sent!');
    })
    .error(function(error) {
        el.text('Something went wrong :(');
    });
}
```

Questions, comments, feedback? Email us at api@fancyhands.com, [create an issue on github](https://github.com/fancyhands/fh-api/issues), or submit a pull request.

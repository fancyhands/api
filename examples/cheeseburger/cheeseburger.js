		                                                                                                                               
		                                                                                                                               
//          ,----..    ,---,                                                                                                             
//         /   /   \ ,--.' |                                                ,---,                                                        
//        |   :     :|  |  :                                              ,---.'|            ,--,  __  ,-.                       __  ,-. 
//        .   |  ;. /:  :  :                          .--.--.             |   | :          ,'_ /|,' ,'/ /|  ,----._,.          ,' ,'/ /| 
//        .   ; /--` :  |  |,--.   ,---.     ,---.   /  /    '     ,---.  :   : :     .--. |  | :'  | |' | /   /  ' /   ,---.  '  | |' | 
//        ;   | ;    |  :  '   |  /     \   /     \ |  :  /`./    /     \ :     |,-.,'_ /| :  . ||  |   ,'|   :     |  /     \ |  |   ,' 
//        |   : |    |  |   /' : /    /  | /    /  ||  :  ;_     /    /  ||   : '  ||  ' | |  . .'  :  /  |   | .\  . /    /  |'  :  /   
//        .   | '___ '  :  | | |.    ' / |.    ' / | \  \    `. .    ' / ||   |  / :|  | ' |  | ||  | '   .   ; ';  |.    ' / ||  | '    
//        '   ; : .'||  |  ' | :'   ;   /|'   ;   /|  `----.   \'   ;   /|'   : |: |:  | : ;  ; |;  : |   '   .   . |'   ;   /|;  : |    
//        '   | '/  :|  :  :_:,''   |  / |'   |  / | /  /`--'  /'   |  / ||   | '/ :'  :  `--'   \  , ;    `---`-'| |'   |  / ||  , ;    
//        |   :    / |  | ,'    |   :    ||   :    |'--'.     / |   :    ||   :    |:  ,      .-./---'     .'__/\_: ||   :    | ---'     
//         \   \ .'  `--''       \   \  /  \   \  /   `--'---'   \   \  / /    \  /  `--`----'             |   :    : \   \  /           
//          `---`                 `----'    `----'                `----'  `-'----'                          \   \  /   `----'            
//                                                                                                           `--`-'                      


$(function() {

	var API_HOST = "http://localhost:8080"
	,   SITE_HOST = "http://localhost:8080"
	,   CURRENT_SITE = window.location.host
    ,   request = ""
	,   title = "";

 	// CONFIG -- put in your keys (get them at fancyhands.com/developer)
    var OAUTH_CONSUMER_KEY = "";
    var OAUTH_CONSUMER_SECRET = "";


	// SEAMLESS
	// =====================================================================================================
	if (CURRENT_SITE === "www.seamless.com") {

		// Adds a class to each product that is a daily special
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

					$btn.on('click', function(e) {
						e.preventDefault();
						sendRequestToFancyHands($(this));
					});
				}
			});
		});

		// Recursively checks to see if the information was loaded into the menu item popup
		function checkIfProductLoaded(callback) {
			if ( $('#fancybox-content').find('.description').length !== 0 ) {
				callback();
				return true;
			} else {
				setTimeout(function() { checkIfProductLoaded(callback) }, 100);
			}
		}
	}


	// AMAZON
	// =====================================================================================================
	if (CURRENT_SITE === "www.amazon.com") {
		
		var amazon_product_url = window.location.href;
		var item = "this item";

		// Sets the name of the item (grabs it from different elements depending on page layout) 
		if ( $('#btAsinTitle').length !== 0 ) item = $('#btAsinTitle').text();
		if ( $('h1#title').length !== 0 ) item = $('h1#title').text();

		request = "Please check to see if " + item + " is in stock at any stores near me. Here's the link: " + amazon_product_url;

		title = "Check inventory of local stores"

		// The module that gets appended to the page
		$fancyHandsRequestBox = $(
			'<div class="fancyhands-request-box">' +
				'<h4>Need this today?</h4>' +
				'<p>Use <strong>Fancy Hands</strong> to find out what stores in your area have this item in stock</p>' +
				'<a id="send-to-fancyhands" class="fancyhands-btn" href="#">Send Request</a>' +
			'</div>'
		)

		// Append the module, different depending on layout
		if( $('.buyingDetailsGrid').length !== 0 ) {
			$('.buyingDetailsGrid').append($fancyHandsRequestBox)
		} else if ( $('#mbc').length !== 0 ) {
			$('#mbc').after($fancyHandsRequestBox);
		} else if ( $('#buybox_feature_div').length !== 0 ) {
			$('#buybox_feature_div').after($fancyHandsRequestBox);
		}

		// Click handler for the Send Request button
		$('#send-to-fancyhands').on('click', function(e) {
			e.preventDefault();
			sendRequestToFancyHands($(this))
		});

		console.log(item)

	}

	function sendRequestToFancyHands(el) {

		// Set expiration date to 24 hours from now
		var expiration_date = new Date();
		expiration_date.setTime(expiration_date.getTime() + (24 * 60 * 60 * 1000)); 
		
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
		console.log(post_data);

		el.text('Sending...');
	
		var url = API_HOST + "/api/v1/request/custom/";
		var method = "POST";
        var _sig_base = sig_base(method, url, post_data);
        var key = encodeURIComponent(OAUTH_CONSUMER_SECRET) + "&";
        post_data['oauth_signature'] = CryptoJS.HmacSHA1(_sig_base, key).toString(CryptoJS.enc.Base64);

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

    // OAuth Utilities
    // ===========================================================
	function rfc3986EncodeURIComponent (str) {  
		return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
    }

	function sig_base(method, url, params) {
		var keys = Object.keys(params) 
		, _params = [];
		
		keys.sort();
		
		for(var i in keys) {
	        _params.push(rfc3986EncodeURIComponent(keys[i] + "=") + 
				rfc3986EncodeURIComponent( rfc3986EncodeURIComponent( params[keys[i]] ))
			);
		}
		return [method, rfc3986EncodeURIComponent(url), _params.join("%26")].join("&")
    }


});
 

(function(window) {
    var FancyHands = window.FancyHands = (function() {

        var api_host = 'https://www.fancyhands.com';
        var OAUTH_CONSUMER_KEY = ""
        var OAUTH_CONSUMER_SECRET = ""

        var custom_get = function() {

        }

        var custom_create = function(options) {
            
            if(!options.title) throw "You need to specify a title";
            if(!options.description) throw "You need to specify a description";
            if(!options.bid) {
                console.warn('Bid price not set. We\'ve automatically set it at $3');
                options.bid = 3;
            }
            if(!options.expiration) {
                console.warn('No expiration set. We\'ve automatically set it to 24hrs from now.');

                var expiration_date = new Date();
                expiration_date.setTime(expiration_date.getTime() + (24 * 60 * 60 * 1000)); 
                options.expiration_date = expiration_date.toISOString();
            }

            // raise errors if no title or description or bid
            var post_data = {
                oauth_consumer_key: OAUTH_CONSUMER_KEY,
                oauth_timestamp: Math.round(new Date().getTime() / 1000),
                oauth_nonce: Math.random() * 10000,
                oauth_signature_method: 'HMAC-SHA1',
            };

            post_data.extend(options);
        }

        var custom_cancel = function() {
            
        }

        var setConsumerKey = function(key) {
            OAUTH_CONSUMER_KEY = key;
        }

        var setConsumerKey = function(secret) {
            OAUTH_CONSUMER_SECRET = secret;
        }


        // Utilities
        // ===========================================================

        // OAuth
        // -------------------------------
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

        // Misc
        // -------------------------------
        Object.prototype.extend = function(obj) {
           for(i in obj)
              this[i] = obj[i];
        };



        // Public API Methods
        // ===========================================================
        return {
            api_host: api_host,
            custom_get: custom_get,
            custom_create: custom_create,
            custom_cancel: custom_cancel
        }
    })();
})(window || this);
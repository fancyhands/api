# Tutorial One - Prank Caller

This is the first tutorial in a series of tutorials on using the Fancy Hands API. Over the course of this tutorial you will learn how to setup and use the Fancy Hands Python API, a basic use case for the API, as well as how to setup and run a basic App Engine server.

Prank Caller is a small webapp that allows you to submit prank calls that the Fancy Hands assistants will place for you. You enter the number you would like pranked, and a short line for the assistants to say to whomever picks up. Once the assistant has completed the prank, they will fill out the reaction they got, and submit it back to you. Lets get started!

## Fancy Hands API

Navigate to the [API Explorer](https://www.fancyhands.com/api/explorer) and follow the steps to get your API keys. These keys are used to identify who you are when using the API. The keys will be labeled key and secret:

![credentials](http://www.fancyhands.com/images/api-tutorials/data-api.png)


## Getting Started with App Engine

Next we will need to setup [Google App Engine](https://developers.google.com/appengine/). Google App Engine will be used to host the application.

1. Download SDK: [Google App Engine SDK for Python (https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python)

2. Install the SDK and launch it. 

3. Now download the base project with all the prerequisites you will need to easily build Prank Caller. 
   Get the base code here: [Fancy Hands Tutorial One](https://github.com/fancyhands/fancyhands-tutorial-1)

     --*or*--

```
git clone https://github.com/fancyhands/fancyhands-tutorial-1
```

Now we need to import the project into Google App Engine. In the Google App Engine Launcher “add an existing application” using the source code you just downloaded. 

Change the Port to 8888 and the Admin Port to 8000.

![adding a new project](http://www.fancyhands.com/images/api-tutorials/add-exisiting.png)

Now start the server by clicking the big green run button.

![starting the server](http://www.fancyhands.com/images/api-tutorials/green-button.png)

## Coding

In your web browser open [http://localhost:8888/](http://localhost:8888/)

You should be presented with the UI for prank caller, but the backend has yet to be hooked up.

Prank Call Flow:

Open main.py and import FancyhandsClient into the project:

<input type="textarea" class="tutorial-python" value="from fancyhands import FancyhandsClient">

Next, in the MainHandler class you will need to create a POST method to catch the posted data and setup the FancyhandsClient. Make sure to change your API keys to what you received in Step One.

<textarea class="tutorial-python">
class MainHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}

        template = JINJA_ENVIRONMENT.get_template('main.html')
        self.response.write(template.render(template_values))

    def post(self):
        # Get the data from the HTML POST
        phone_number = self.request.get('phone-number')
        prank_text = self.request.get('prank-text')

        # Set your Fancy Hands API Key and Secret here
        api_key = '<YOUR API KEY>'
        secret = '<YOUR API SECRET>'

        # Setup the Fancy Hands Client
        client = FancyhandsClient(api_key, secret)</textarea>

      Now you need to setup some basic data to be posted to Fancy Hands so they can fulfil the request. In MainHandler’s post method write this:

<textarea class="tutorial-python">
# What our assistants see when selecting what request to perform.
# In this case it will be Prank Call - 555-555-5555.
title = 'Prank Call - %s' % phone_number

# This is the content of the request.
# In this case we just use what you want said in your prank.
description = prank_text

# This is the price you are willing to pay for the request to be completed.
bid = 4.0

# This is when the task expires from our system.
# This must be no more than 7 days in the future and is required.
expiration_date = datetime.now() + timedelta(1)</textarea>

      Next we are going to build the custom form data the assistant will see. This allows you to build forms (textarea's, phone numbers, dates, ...) that the assistant must fill out before sending the request. These are sent via JSON, but you can build them in python as dictionaries to pass into the Fancy Hands Python API. Add this code under expiration_date to create a required textarea named "Reaction" for the assistant to fill out. 

<textarea class="tutorial-python">
custom_fields = []
custom_field = {
  'label':'Reaction',
  'type':'textarea',
  'description':'What was their reaction?',
  'order':1,
  'required':True,
}
custom_fields.append(custom_field)"></textarea>

      Now lets create the request with the Fancy Hands Python API by passing in all variables we created above.

<textarea class="tutorial-python">prank_request = client.custom_create(title, description, bid, expiration_date, custom_fields)</textarea>

      Next lets create an App Engine model to save the pranks. Put this below the MainHandler class.

<textarea class="tutorial-python">
class PrankModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    title = db.StringProperty()
    content = db.TextProperty()
    status = db.StringProperty()
    bid = db.FloatProperty()
    fh_key = db.StringProperty()</textarea>

      Now lets create a classmethod on the PrankModel that converts the json returned from Fancy Hands Python API into the model.

<textarea class="tutorial-python">
  class PrankModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    title = db.StringProperty()
    content = db.TextProperty()
    status = db.StringProperty()
    bid = db.FloatProperty()
    fh_key = db.StringProperty()

    @classmethod
    def create_from_callback(self, callback):
        prank = PrankModel.all().filter('fh_key =', callback['key']).get()

        if prank:
          prank.status = callback['status']
          prank.numeric_status = callback['numeric_status']
        else:
          prank = PrankModel()
          prank.status = callback['status']
          prank.title = callback['title']
          prank.content = callback['content']
          prank.status = callback['status']
          prank.bid = float(callback['api_bid'])
          prank.fh_key = callback['key']

        prank.put()
        return prank</textarea>

      Next we need to pass "prank_request" into the "PrankModel" and render it using the prebuilt template.

<textarea class="tutorial-python">
prank = PrankModel.create_from_callback(prank_request)

# Render new data
template_values = {'prank':prank}
template = JINJA_ENVIRONMENT.get_template('main.html')
self.response.write(template.render(template_values))</textarea>

      Now that we have the model created lets do the check in get for a current prank and pass it into the prebuilt template.

<textarea class="tutorial-python">
class MainHandler(webapp2.RequestHandler):
    def get(self):
        prank = PrankModel.all().order('-date_updated').get()
        template_values = {'prank':prank}

        template = JINJA_ENVIRONMENT.get_template('main.html')
        self.response.write(template.render(template_values))</textarea>

      The last thing we need to do is catch the callback from the Fancy Hands API. After every action from an assistant the app will recieve a callback from Fancy Hands with updates on the request. We also need to add the routing for "/callback".

<textarea class="tutorial-python">
class CallbackHandler(webapp2.RequestHandler):
    def post(self):
      callback = dict(urlparse.parse_qsl(self.request.body))
      callback_to_model(callback)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/callback', CallbackHandler),
], debug=True)</textarea>

## **Make It Live**

      Follow the steps [Here](https://developers.google.com/appengine/docs/java/gettingstarted/uploading) to launch prank caller onto a google appspot domain.

      Your URL will look something like prank-caller@appspot.com. You should now change your webhook on fancyhands to yourdomain.appspot.com/callback. You can do that [Here](https://www.fancyhands.com/api/oauth/developer)

      ![](/images/api-tutorials/webhook.png)

      That's it! You can view or download the completed project [Here.](https://github.com/fancyhands/fancyhands-tutorial-1)

 

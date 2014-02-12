fancyhands-python
=========

Python library for the [Fancy Hands API]. Signup [here.]

Version
----

0.1

Requirements
-----------
* [oauth2]

Installation
--------------

```sh
git clone git@github.com:fancyhands/fancyhands-python.git
cd fancyhands-python
python setup.py install
```
Usage
----------
##### Get all your custom requests:

```python
from fancyhands import FancyhandsClient

api_key = 'your_api_key'
secret = 'your_api_secret'

client = FancyhandsClient(api_key, secret)

# Get last 20 requests
requests = client.custom_get()

# Create a new request
from datetime import datetime, timedelta

title = 'Call Nicholas'
description = 'Tell him to make me some toast.'
bid = 4.0
expiration_date = datetime.now() + timedelta(1)

custom_fields = []
custom_field = {
  'label':'Response',
	'type':'textarea',
	'description':'When will my toast be done?',
	'order':1,
	'required':True,
}
custom_fields.append(custom_field)

request = client.custom_create(title, description, bid, expiration_date, custom_fields)
```

License
----
MIT

  [Fancy Hands API]: https://www.fancyhands.com/developer
  [here.]: https://www.fancyhands.com/api/explorer

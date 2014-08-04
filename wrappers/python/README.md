fancyhands-python
=========

Python library for the [Fancy Hands API](https://www.fancyhands.com/developer). 
[Full documentation for the API](https://github.com/fancyhands/api/wiki) lives on github.

Version
----

0.1

Requirements
-----------
* [oauth2]

Installation
--------------

```git clone https://github.com/fancyhands/api.git
cd api/wrappers/python
python setup.py install
# or just copy the api/wrappers/python directory to your project (probably want to rename it)
```


Usage
----------
##### Dealing with 'custom' requests

```from fancyhands import FancyhandsClient

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

The MIT License (MIT)

Copyright (c) 2013-2014 Fancy Hands, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

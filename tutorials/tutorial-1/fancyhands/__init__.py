from urllib import urlencode
import oauth2 as oauth
import json

API_HOST = 'http://localhost:8080'

class FancyhandsClient(object):
	def __init__(self, api_key, secret):
		self.api_key = api_key
		self.secret = secret

	def oauth_request(self, uri='', query_params={}, http_method='GET'):
		url = API_HOST + uri

		consumer = oauth.Consumer(key=self.api_key, secret=self.secret)
		client = oauth.Client(consumer)

		if http_method == 'GET':
			url += '?%s' % urlencode(query_params)
			resp, content = client.request(url, http_method)
		else:
			resp, content = client.request(url, http_method, body=urlencode(query_params))

		try:
			content = json.loads(content)
		except:
			raise Exception(content)

		return content

	""" 
    This will allow you to get any request you have submitted.
    """
	def custom_get(self, key=None, status=None, cursor=None):
		uri = '/api/v1/request/custom/'

		query_params = {
			'key': key,
			'status': status,
			'cursor': cursor,
		}
		query_params = {i:j for i,j in query_params.items() if j != None}

		return self.oauth_request(uri=uri, query_params=query_params, http_method='GET')

	""" 
    This will allow you to submit a task, specify which data you'd like back (custom_fields) and set the price (bid) you're willing to pay.
    """
	def custom_create(self, title=None, description=None, bid=None, expiration_date=None, custom_fields={}, test=False):
		uri = '/api/v1/request/custom/'

		query_params = {
			'title': title,
			'description': description,
			'bid': bid,
			'expiration_date': expiration_date,
			'custom_fields': json.dumps(custom_fields),
			'test':test,
		}

		return self.oauth_request(uri=uri, query_params=query_params, http_method='POST')

	""" 
    This is the cancel method. Calling this method will cancel a request from being completed. 
    If the task hasn't been started, you can cancel. Otherwise, it will fail. 
    """
	def custom_cancel(self, key=None):
		uri = '/api/v1/request/custom/cancel/'

		query_params = {
			'key': key,
		}

		return self.oauth_request(uri=uri, query_params=query_params, http_method='POST')
import os
import openai
import requests
import dotenv
import trafilatura
import gpt_index
from pprint import pprint

import logging
logging.basicConfig(level=logging.DEBUG)

dotenv.load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")
bing_search_api_key = os.environ['BING_SEARCH_V7_SUBSCRIPTION_KEY']
bing_search_endpoint = os.environ['BING_SEARCH_V7_ENDPOINT'] + 'v7.0/search'


def search(query):
    response = requests.get(bing_search_endpoint, headers={
        'Ocp-Apim-Subscription-Key': bing_search_api_key}, params={'q': query, 'mkt': 'en-US'}).json()
    return [result for result in response.get('webPages', {}).get('value', [])]


def add_website_content(result):
    result['content'] = trafilatura.extract(
        trafilatura.fetch_url(url=result['url']))
    return result


def answer_question(question):
    results = search(question)
    results_with_content = [add_website_content(
        result) for result in results[:5]]

    results_with_split_content = [
        {'name': result['name'],
         'url': result['url'],
         'snippet': snippet} for result in results_with_content
        for snippet in result['content'].split('\n') if len(snippet) > 200]

    documents = [gpt_index.Document(result['snippet'], extra_info={
                                    'url': result['url']}) for result in results_with_split_content]

    index = gpt_index.GPTListIndex(documents)

    response = index.query(question, mode="embedding")
    pprint(response)
    return response.response.strip('\n').strip()

import requests
from graphql.parser import GraphQLParser
from middleware.exceptions import RequestException


def validate_graphql_request(payload: str):
    """Method to parse http request payload to verify if it is a valid GraphQL query or mutation and return a GraphQL document."""

    try:
        return GraphQLParser().parse(payload)
    except Exception:
        raise RequestException(400, 'Invalid GraphQL payload.')


def execute_graphql_request(payload: dict, *graphql_headers: tuple):
    """Method to execute http request on the GraphQL API."""

    # Build headers
    headers = {'Content-Type': 'application/json'}
    if graphql_headers != ():
        headers['authorization'] = graphql_headers[0]['authorization']

    url = 'http://graphql:5433/graphql'
    response = requests.post(url, headers=headers, json=payload)
    status = response.status_code
    data = response.json()

    return status, data

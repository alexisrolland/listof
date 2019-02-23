from flask import request, jsonify, make_response
from flask_restplus import Resource, fields, Namespace, Api
from middleware.exceptions import RequestException
from middleware.utils import validate_graphql_request, execute_graphql_request
from security.utils import is_token_valid


def register_graphql(namespace: Namespace, api: Api):
    """Method used to register the GraphQL namespace and endpoint."""

    # Create expected headers and payload
    headers = api.parser()
    headers.add_argument('Authorization', type=str, location='headers', help='Valid token.')
    payload = api.model('Payload', {'query': fields.String(
        required=True,
        description='GraphQL query or mutation',
        example='{allSysDataTypes{nodes{name}}}')})

    @namespace.route('/graphql', endpoint='with-parser')
    @namespace.doc()
    class GraphQL(Resource):

        @namespace.expect(headers, payload, validate=True)
        def post(self):
            """
            Execute GraphQL queries and mutations
            Use this endpoint to send http request to the GraphQL API.
            """
            try:
                # Verify is token is valid
                token = headers.parse_args().Authorization
                if is_token_valid(token):

                    # Create expected headers and payload for PostGraphile
                    graphql_headers = {'Authorization': f'Bearer {token}'}
                    payload = request.json

                    # Execute request on GraphQL API
                    status, data = execute_graphql_request(payload, graphql_headers)
                    if status != 200:
                        raise RequestException(status, data)

                    return make_response(jsonify(data), status)
                
                # If token is invalid, fail request
                else:
                    raise RequestException(403, 'Request failed! Invalid token.')

            except RequestException as exception:
                return exception.to_response()

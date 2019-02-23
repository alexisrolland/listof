from flask import jsonify, make_response
from flask_restplus import Resource, Namespace, Api
from middleware.utils import validate_graphql_request, execute_graphql_request
from middleware.exceptions import RequestException
from security.utils import get_token


def register_security(namespace: Namespace, api: Api):
    """Method used to register the security namespace and endpoints."""

    # Create expected headers and payload
    headers = api.parser()
    headers.add_argument('login', type=str, location='headers', help='User login')
    headers.add_argument('password', type=str, location='headers', help='User password')

    @namespace.route('/token')
    @namespace.doc()
    class Token(Resource):

        @namespace.expect(headers, validate=True)
        def get(self):
            """
            Get token
            Use this endpoint to get the token in exchange from a valid user login and password.
            """

            # Build payload for GraphQL http request
            args = headers.parse_args()
            payload = {
                'query': 'mutation authenticateUser($userEmail: String, $userPassword: String) { authenticateUser(input: { userEmail: $userEmail userPassword: $userPassword }) { sysUser { id email role flagActive }}}',
                'variables': {
                    'userEmail': args.login,
                    'userPassword': args.password
                }
            }

            try:
                # Execute request on GraphQL API
                status, data = execute_graphql_request(payload)
                if status != 200:
                    raise RequestException(status, data)

                # If response is empty, credentials are incorrect
                if data['data']['authenticateUser']['sysUser'] is None:
                    raise RequestException(403, 'Login failed! User login or password incorrect.')

                # If flagActive is false, user is inactive
                elif data['data']['authenticateUser']['sysUser']['flagActive'] is False:
                    raise RequestException(403, 'Login failed! User has been inactivated.')

                # Else login successfull
                else:
                    user = data['data']['authenticateUser']['sysUser']
                    token = {'token': get_token(user)}

                return make_response(jsonify(token), status)

            except RequestException as exception:
                return exception.to_response()

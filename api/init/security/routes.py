from flask import jsonify, make_response
from flask_restplus import Resource, Namespace, Api
from proxy.utils import validate_graphql_request, execute_graphql_request
from proxy.exceptions import RequestException


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

            # Build payload of http request
            args = headers.parse_args()
            payload = {}
            payload['query'] = "mutation authenticateUser($userEmail: String, $userPassword: String) { authenticateUser(input: { userEmail: $userEmail userPassword: $userPassword }) { sysUser { id email role flagActive }}}"
            payload['variables']['userEmail'] = args.login
            payload['variables']['userPassword'] = args.password

            try:
                # Execute request on GraphQL API
                status, data = execute_graphql_request(payload)
                if status != 200:
                    raise RequestException(status, data)

                return make_response(jsonify(data), status)

            except RequestException as exception:
                return exception.to_response()

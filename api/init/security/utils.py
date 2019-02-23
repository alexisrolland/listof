import time
from jwt import JWT
from security.keys import get_private_key, get_public_key


# Set token validity to 1h
TOKEN_VALIDITY = 3600


def get_token(user: dict):
    """Gets a signed JWT token for the user."""

    now = time.time()
    message = {
        'issue_at': now,
        'expire_at': now + TOKEN_VALIDITY,
        'email': user['email']
    }

    # Arguments required by PostGraphile
    message['aud'] = "postgraphile",
    message['role'] = user['role'],
    message['user_id'] = user['id']

    private_key = get_private_key()
    return JWT().encode(message, private_key, 'RS256')


def is_token_valid(token: str):
    """Checks if a JWT is valid."""

    public_key = get_public_key()
    try:
        decrypted_token = JWT().decode(token, public_key)
        return int(decrypted_token['expire_at']) > time.time()

    except:
        return False
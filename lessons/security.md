# CRSF (Cross-Site Request Forgery)

CSRF is an attack that tricks the victim into submitting a malicious request. It inherits the identity and privileges of the victim to perform an undesired function on their behalf. For most sites, browser requests automatically include any credentials associated with the site, such as the user's session cookie, IP address, Windows domain credentials, and so forth. Therefore, if the user is authenticated, the site will have no way to distinguish between the forged request sent by the attacker and a legitimate request sent by the victim.

[Read more](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Scenario

You have an account in bank website. You are logged in and you have a session cookie. hacker sends you a link to a website. You click the link and it sends a request to the bank website to transfer money to hacker's account. The request is sent with your session cookie so the bank website thinks it's you who sent the request.

## How to prevent CSRF

1. **Use CSRF tokens**: A CSRF token is a random, hard-to-guess string. The server sends the token to the client in a hidden form field. When the client submits a form, it sends the token along with the form data. The server checks if the token is valid. If the token is missing or invalid, the server rejects the request (even if the user has his own token as authenticated).

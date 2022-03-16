function login() {
  const url = "https://findmybus.auth.eu-west-1.amazoncognito.com/login?client_id=3vvpamg4sflamvg9lnfvav8btm&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback";

  window.location.href = url;
}

login();

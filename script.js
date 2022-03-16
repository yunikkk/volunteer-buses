function login() {
  const url = "https://findmybus.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=3vvpamg4sflamvg9lnfvav8btm&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https%3A%2F%2Fyunikkk.github.io%2Fvolunteer-buses";

  window.location.href = url;
}

login();

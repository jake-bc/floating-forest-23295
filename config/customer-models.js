var request = require("request");

var customers = {
    method: 'GET',
    url: 'https://www.xjake.cloud/api/v2/customers',
    headers:
        {
            'cache-control': 'no-cache',
            authorization: 'Basic eGpha2U6YWZkNjc4ZDM0NDk2ZGIyNjBkZTA5Y2MxMzExMTM2MWU0MzM0YjFlOQ==',
            'x-auth-token': 'g2fegqamvvj6ssm9gry46wj2a0ak8xt',
            'x-auth-client': 'm4um1i8wji1n81r5wlp15dj7hotl2k5',
            'content-type': 'application/json',
            accept: 'application/json'
        }
};

request(customers, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});

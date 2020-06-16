# Odoo xmlrpc client


See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to this project.

## Installation

```sh
$ npm install odoo-xmlrpc-client
```

## Example

**Disclaimer**: please, refer to
[Odoo External API documentation](https://www.odoo.com/documentation/master/webservices/odoo.html)
for detailed usage of `odoo.executeKw` parameters.

#### Connection configuration

```js
const { Odoo } = require('odoo-xmlrpc-client');

const odoo = Odoo({
  url: 'http://localhost', // odoo server url
  // port: 8069,           // <optional odoo port>
  db: 'odoo',              // database name
  username: '',            // odoo username
  password: '',            // odoo password
});
```


#### Usage with promises

```js
odoo.authenticate().then(() => {
  odoo.executeKw(
    'res.partner',
    'search',
    [[['customer', '=', true]]],
    {}
  ).then(ids => {
    console.log('ids: ', ids);
    odoo.executeKw(
      'res.partner',
      'read',
      ids,
      { 'fields': ['name', 'country_id', 'comment', 'is_company', 'customer'] }
    ).then(res => {
      console.log('Results: ', res);
    })
  });
})
```

#### Usage with async/await

```js
await odoo.authenticate();
console.log('Connected to Odoo server.');
const ids = await odoo.executeKw(
    'res.partner',
    'search',
    [[['customer', '=', true]]],
    {}
);
console.log('ids: ', ids);
const res = await odoo.executeKw(
    'res.partner',
    'read',
    ids,
    { 'fields': ['name', 'country_id', 'comment', 'is_company', 'customer'] }
);
console.log('Results: ', res);
```

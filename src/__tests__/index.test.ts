import { Odoo } from '../index';

test('My Odoo', async () => {
  const odoo = Odoo({
    url: 'http://localhost',
    port: 8069,
    db: 'odoo',
    username: 'admin',
    password: 'admin',
  });

  try {
    await odoo.executeKw('', '');
    expect(true).toBe(false); // should always throw an exception
  } catch (error) {
    expect(error).toBeDefined();
  }

  const uid = await odoo.authenticate();
  expect(uid).toBe(1);

  const ids = await odoo.executeKw(
    'res.partner',
    'search',
    [[['customer', '=', true]]],
    {},
  );
  expect(ids).toEqual([7]);

  const res = await odoo.executeKw('res.partner', 'read', ids, {
    fields: ['name', 'country_id', 'comment', 'is_company', 'customer'],
  });
  expect(res).toHaveLength(1);
  expect(res[0].id).toBe(7);
  expect(res[0].name).toBe('Cliente 01');
});

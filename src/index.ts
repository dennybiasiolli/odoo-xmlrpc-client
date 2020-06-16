import { Client, createClient, createSecureClient } from 'xmlrpc';
import { parse as urlParse } from 'url';

type OdooConfig = {
  url: string;
  host?: string;
  port?: number;
  db?: string;
  username?: string;
  password?: string;
  secure?: boolean;
};

export function Odoo(config: OdooConfig) {
  const urlparts = urlParse(config.url);
  config.host = urlparts.hostname || undefined;
  if (urlparts.port) {
    config.port = parseInt(urlparts.port, 10);
  }
  config.secure = urlparts.protocol === 'https:';
  let uid = 0;

  /**
   * Create and returns an xmlrpc client
   * @param {string} path path to use for the connection
   * @returns {Client} xmlrpc client
   */
  const getClient = (path: string) => {
    const createClientFn = config.secure ? createSecureClient : createClient;
    return createClientFn({
      host: config.host,
      port: config.port,
      path,
    });
  };

  const methodCall = (client: Client, method: string, params: any[]): any => {
    return new Promise((resolve, reject) => {
      client.methodCall(method, params, (err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
    });
  };

  const authenticate = async (): Promise<number> => {
    try {
      uid = (await methodCall(getClient('/xmlrpc/2/common'), 'authenticate', [
        config.db,
        config.username,
        config.password,
        {},
      ])) as number;
      return uid;
    } catch (error) {
      throw error;
    }
  };

  const executeKw = (
    model: string,
    method: string,
    args: any[] = [],
    kwargs: object = {},
  ): Promise<any> => {
    if (!uid) {
      throw new Error('User is not logged');
    }
    return methodCall(getClient('/xmlrpc/2/object'), 'execute_kw', [
      config.db,
      uid,
      config.password,
      model,
      method,
      args,
      kwargs,
    ]);
  };

  return { authenticate, executeKw };
}


import * as config from '@/config';
import PriceFormatter from './priceFormatter';
import ScatterJS from './scatterjs';
import Fibos from 'fibos.js';
// api https://get-scatter.com/docs/api-create-transaction

// @trick: use function to lazy eval Scatter eos, in order to avoid no ID problem.

const fibos = () => ScatterJS.scatter.fibos(config.network, Fibos, { expireInSeconds: 60 });
const currentEOSAccount = () => ScatterJS.scatter.identity && ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'fibos');
const fibosReader = Fibos({
  broadcast: false,
  sign: false,
  chainId: config.network.chainId,
  keyPrefix: 'FO',
  httpEndpoint: `${config.network.protocol}://${config.network.host}:${config.network.port}`,
});

const API = {
  async getEvents() {
    const { rows } = await fibos().getTableRows({
      json: true,
      code: config.contractName,
      scope: config.contractName,
      table: 'events',
      limit: 1024,
    });
    return rows;
  },
  async getOffers() {
    const { rows } = await fibosReader.getTableRows({
      json: true,
      code: config.contractName,
      scope: config.contractName,
      table: 'offers',
      limit: 1024,
    });
    return rows;
  },
  connectScatterAsync() {
    return ScatterJS.scatter.connect(config.appScatterName, { initTimeout: 2000 });
  },
  loginScatterAsync() {
    const requiredFields = { accounts: [config.network] };
    return ScatterJS.scatter.getIdentity(requiredFields);
  },
  logoutScatterAsync() {
    return ScatterJS.scatter.forgetIdentity();
  },
};

export default API;
export { fibos, currentEOSAccount };

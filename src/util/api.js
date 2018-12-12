
import * as config from '@/config';
import PriceFormatter from './priceFormatter';
import store from '@/store'

// api https://get-scatter.com/docs/api-create-transaction

// @trick: use function to lazy eval Scatter eos, in order to avoid no ID problem.


const API = {
  async getEvents() {
    const { rows } = await store.state.scatterReader.getTableRows({
      json: true,
      code: config.contractName,
      scope: config.contractName,
      table: 'events',
      limit: 1024,
    });
    return rows;
  },
  async getOffers() {
    const { rows } = await store.state.scatterReader.getTableRows({
      json: true,
      code: config.contractName,
      scope: config.contractName,
      table: 'offers',
      limit: 1024,
    });
    return rows;
  },
  async makeOffer(eventId, stake, betChoose, makerOdds) {
    const transaction = [
      {
        account: config.contractName,
        name: 'offerbet',
        data: {
          event_id: eventId,
          maker:  store.state.scatterAccount.name,
          stake:  PriceFormatter.formatQuantity(stake),
          bet_choose: betChoose,
          maker_odds:makerOdds,
        },
      },
    ]
    return this.pushTransaction(transaction);
  },
  async updateAuth(account, permission, parent, auth) {
    const transaction = [
      {
        account: 'eosio',
        name: 'updateauth',
        data: {
          account,
          permission,
          parent,
          auth,
        },
      }
    ]
    return this.pushTransaction(transaction);
  },
  async getMyOffers(accountName) {
    const { rows } = await store.state.scatterReader.getTableRows({
      json: true,
      code: config.contractName,
      scope: accountName,
      table: 'offers',
      limit: 1024,
    });
    return rows;
  },
  async getMyBets(accountName) {
    const { rows } = await store.state.scatterReader.getTableRows({
      json: true,
      code: config.contractName,
      scope: accountName,
      table: 'bets',
      limit: 1024,
    });
    return rows;
  },
  async pushTransaction(transaction) {
    if (!store.state.scatterAccount) {
      throw Error('Require network connection and identity')
    }
    const actions = transaction.map(tx => ({
      ...tx,
      authorization: [{ actor:store.state.scatterAccount.name, permission:store.state.scatterAccount.authority }],
    }));
    console.log(`Attempting to send tx to ironman: ${JSON.stringify(actions, null, 2)}`);
    return store.state.scatterWriter.transaction({ actions });
  }
};

export default API;

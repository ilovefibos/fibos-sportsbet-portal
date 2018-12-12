import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/util/api'
import Fibos from 'fibos.js'
import * as config from '@/config';
import ScatterJS from '../util/scatterjs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isScatterConnected: false,
    scatterAccount: null,
    isScatterLoggingIn: false,
    scatterReader: null,
    scatterWriter: null,
    activeAuthority: null,
    loadingActiveAuthority: false,
  },
  getters: {
    activeAuthorityContractEntry(state) {
      return !state.activeAuthority
        ? undefined
        : state.activeAuthority.accounts.find(a =>
          a.permission.actor === config.contractName &&
            a.permission.permission === 'eosio.code');
    },
    hasGrantedPermission(state, getters) {
      const contractEntry = getters.activeAuthorityContractEntry;
      return (
        contractEntry && contractEntry.weight >= state.activeAuthority.threshold
      );
    }
  },
  mutations: {
    setIsScatterLoggingIn (state, isScatterLoggingIn) {
      state.isScatterLoggingIn = isScatterLoggingIn
    },
    setIsScatterConnected (state, isScatterConnected) {
      state.isScatterConnected = isScatterConnected
    },
    setScatterReader (state, reader) {
      state.scatterReader = reader
    },
    setScatterWriter (state, writer) {
      state.scatterWriter = writer
    },
    setScatterAccount (state, account) {
      state.scatterAccount = account
    },
    setActiveAuthority(state, authority) {
      state.activeAuthority = authority;
    },
    setLoadingActiveAuthority(state, loading) {
      state.loadingActiveAuthority = loading;
    },
  },
  actions: {
    async connectScatterAsync ({commit, dispatch}) {
      const fibosReader = Fibos({
        broadcast: false,
        sign: false,
        chainId: config.network.chainId,
        keyPrefix: 'FO',
        httpEndpoint: `${config.network.protocol}://${config.network.host}:${config.network.port}`,
      });
      commit('setScatterReader', fibosReader)
      console.log('Connecting to Scatter...')
      const connected = await ScatterJS.scatter.connect(config.appScatterName)
      console.log('Connect Scatter result: ', connected)
      if (connected) {
        commit('setIsScatterConnected', true)
        const id = await ScatterJS.scatter.getIdentity({ accounts: [config.network] });
        const match = id && id.accounts.find(x => x.blockchain === 'fibos');
        if (match) {
          commit('setScatterAccount', match)
          const networkOptions = {
            broadcast: true,
            sign: true,
            chainId: config.network.chainId,
            keyPrefix: 'FO',
            expireInSeconds: 60
          };
          const fibosWriter = ScatterJS.scatter.fibos(config.network, Fibos, networkOptions);
          commit('setScatterWriter', fibosWriter)
          await dispatch('loadActiveAuthority');
        }
      }
    },
    async loadActiveAuthority({ state, commit }) {
      commit('setLoadingActiveAuthority', true);
      commit('setActiveAuthority', null);
      const accountInfo = await state.scatterReader.getAccount({
        account_name: state.scatterAccount.name
      });
      const authority = accountInfo.permissions.find(p => p.perm_name === 'active').required_auth;
      commit('setActiveAuthority', authority);
      commit('setLoadingActiveAuthority', false);
    },
    async grantPermission({ state, dispatch, getters }) {
      // Ensure we have a fresh copy
      await dispatch('loadActiveAuthority');
      const authority = { ...state.activeAuthority };
      const contractEntry = getters.activeAuthorityContractEntry;

      if (contractEntry) {
        authority.accounts = [
          ...authority.accounts.filter(a => a !== contractEntry),
          {
            ...contractEntry,
            weight: authority.threshold
          }
        ];
      } else {
        authority.accounts = [
          ...authority.accounts,
          {
            permission: {
              actor: config.contractName,
              permission: 'eosio.code'
            },
            weight: authority.threshold
          }
        ];
      }

      try {
        await API.updateAuth(
          state.scatterAccount.name,
          'active',
          'owner',
          authority
        );
        await dispatch('loadActiveAuthority');
      } catch (error) {
        Vue.toasted.error(`Failed to Update Auth: ${error.message}.`, {duration: 3000})
      }
    },
    async removePermission({ state, dispatch, getters }) {
      const authority = {
        ...state.activeAuthority,
        accounts: state.activeAuthority.accounts.filter(a => a !== getters.activeAuthorityContractEntry)
      };

      try {
        await API.updateAuth(
          state.scatterAccount.name,
          'active',
          'owner',
          authority
        );
        await dispatch('loadActiveAuthority');
      } catch (error) {
        Vue.toasted.error(`Failed to Update Auth: ${error.message}.`, {duration: 3000})
      }
    },
    async loginScatterAsync ({commit, dispatch}) {
      commit('setIsScatterLoggingIn', true)
      try {
        const identity = await ScatterJS.scatter.getIdentity({ accounts: [config.network] });
        if (!identity) {
          commit('setScatterAccount', null)
          return
        }
        const account = identity.accounts.find(x => x.blockchain === 'fibos')
        commit('setScatterAccount', account)
        const fibosWriter = ScatterJS.scatter.fibos(config.network, Fibos, { expireInSeconds: 60 });
        commit('setScatterWriter', fibosWriter)
        await dispatch('loadActiveAuthority');
        Vue.toasted.success('You successfully logged in Ironman!', {duration: 3000})
      } catch (err) {
        console.error('Failed to login Ironman', err)
        Vue.toasted.error(`Failed to login Ironman: ${err.message}.`, {duration: 3000})
      }
      commit('setIsScatterLoggingIn', false)
    },
    async logoutScatterAsync ({commit}) {
      try {
        await ScatterJS.scatter.forgetIdentity()
      } catch (err) {
        console.error('Failed to logout Ironman', err)
      }
      commit('setScatterAccount', null)
      Vue.toasted.success('You successfully logged out!', {duration: 3000})
    },
  },
})

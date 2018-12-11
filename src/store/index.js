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
    isLoadingData: false,
    scatterReader: null,
    scatterWriter: null
  },
  mutations: {
    setIsScatterLoggingIn (state, isScatterLoggingIn) {
      state.isScatterLoggingIn = isScatterLoggingIn
    },
    setIsLoadingData (state, isLoadingData) {
      state.isLoadingData = isLoadingData
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
          commit('setScatterAccount', id)
          const fibosWriter = ScatterJS.scatter.fibos(config.network, Fibos, { expireInSeconds: 60 });
          commit('setScatterWriter', fibosWriter)
        }
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
        console.log(account)
        commit('setScatterAccount', account)
        const fibosWriter = ScatterJS.scatter.fibos(config.network, Fibos, { expireInSeconds: 60 });
        commit('setScatterWriter', fibosWriter)
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

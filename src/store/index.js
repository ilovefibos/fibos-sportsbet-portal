import Vue from 'vue'
import Vuex from 'vuex'
import API, { currentEOSAccount } from '@/util/api'
import ui from './ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
  },
  state: {
    isScatterConnected: false,
    scatterAccount: null,
    isScatterLoggingIn: false,
    isLoadingData: false,
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
    setScatterAccount (state, account) {
      state.scatterAccount = account
    },
  },
  actions: {
    async connectScatterAsync ({commit, dispatch}) {
      console.log('Connecting to Scatter...')
      const connected = await API.connectScatterAsync()
      console.log('Connect Scatter result: ', connected)
      if (connected) {
        commit('setIsScatterConnected', true)
        if (currentEOSAccount()) {
          commit('setScatterAccount', currentEOSAccount())
        }
      }
    },
    async loginScatterAsync ({commit, dispatch}) {
      commit('setIsScatterLoggingIn', true)
      try {
        const identity = await API.loginScatterAsync()
        if (!identity) {
          commit('setScatterAccount', null)
          return
        }
        const account = identity.accounts.find(({blockchain}) => blockchain === 'fibos')
        commit('setScatterAccount', account)
        Vue.toasted.success('You successfully logged in Ironman!', {duration: 3000})
      } catch (err) {
        console.error('Failed to login Ironman', err)
        Vue.toasted.error(`Failed to login Ironman: ${err.message}.`, {duration: 3000})
      }
      commit('setIsScatterLoggingIn', false)
    },
    async logoutScatterAsync ({commit}) {
      try {
        await API.logoutScatterAsync()
      } catch (err) {
        console.error('Failed to logout Ironman', err)
      }
      commit('setScatterAccount', null)
      Vue.toasted.success('You successfully logged out!', {duration: 3000})
    },
  },
})

export default {
  namespaced: true,
  state: {
    globalSpinnerVisible: false,
  },
  mutations: {
    setGlobalSpinnerVisible(state, visible) {
      state.globalSpinnerVisible = visible;
    },
  },
};

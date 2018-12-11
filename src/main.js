import Vue from 'vue';
import './plugins/vuetify'
import './plugins/toasted'
import '@/util/prototypeExtend';
import '@/theme/icon.scss'
import VueMoment from 'vue-moment';
import Transitions from 'vue2-transitions';
import VueClipboard from 'vue-clipboard2';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';
import API from '@/util/api';
import PriceFormatter from '@/util/priceFormatter';
import App from '@/App.vue';
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;
Vue.use(VueMoment);
Vue.use(Transitions);
Vue.use(VueClipboard);
Vue.use(PriceFormatter);
Vue.use(API);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');

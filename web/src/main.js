import '@babel/polyfill';
import Vue from 'vue';
import { DateTime } from 'luxon';
import './plugins/vuetify';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.filter('formatIsoDateTime', (value) => {
  if (value !== undefined) {
    return DateTime.fromISO(value).toFormat('dd/MM/yyyy HH:mm:ss');
  }

  return '';
});

new Vue({
  render: h => h(App)
}).$mount('#app');

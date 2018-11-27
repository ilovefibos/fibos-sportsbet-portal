<template>
  <div class="home">
    <Loading v-if="!mapLoad" loadText="loading ..." />

  </div>
</template>

<script>

import Loading from '@/components/Loading.vue';
import { mapState } from 'vuex'
import { setLocalStorage, removeLocalStorage } from '@/util/storeUtil.js'

export default {
  name: 'map-view',
  data() {
    return {
      mapLoad: true
    };
  },
  components: {
    Loading
  },
  computed: {
    ...mapState(['scatterAccount'])
  },
  watch: {
    scatterAccount(val) {
      if (val) {
        this.coreLogin(val)
      }
    },
  },
  created() {

  },
  mounted() {
    this.jumped = false;
  },
  methods: {
    coreLogin(account) {
      if (!account || !account.name) {
        return false
      }
    }
  },
  destroyed() {

  },
};
</script>

<style lang="sass" scoped>
.home
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 0
</style>

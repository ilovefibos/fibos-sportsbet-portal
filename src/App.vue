<template>
  <div id="app">
    <Loading v-show="globalProgressVisible || globalSpinnerVisible" loadText="loading ..." />
    <div class="app-nav is-hidden-mobile">
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isScatterLoggingIn }]"
        @click="loginScatterAsync"
        v-if="!scatterAccount"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
      </button>
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined']"
        @click="logoutScatterAsync"
        v-if="isScatterConnected && scatterAccount"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('logout')}} {{scatterAccount.name}}
      </button>
      <router-link class="nav-item" to="/">{{$t('home')}}</router-link>
      <a class="nav-item" @click="aboutShow=!aboutShow">{{$t('about_view')}}</a>
    </div>
    <Aboutview
      :aboutShow="aboutShow"
      :mobileAboutShow="mobileAboutShow"
      @CloseAboutView="CloseAboutView"
      @CloseMobileAboutView="CloseMobileAboutView"
    />
    <div class="app-footer">
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://github.com/lowwor/fibos-sportsbet"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile">{{$t('contract_creator')}}</div>
      <div class="footer-item is-hidden-mobile">{{$t('powered_by')}} <a target="_blank" href="https://fibos.io/">FIBOS</a></div>
      <div class="footer-item is-hidden-mobile">
        <b-select class="is-inverted" v-model="$i18n.locale" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">English</option>
          <option value="zh">简体中文</option>
        </b-select>
      </div>
    </div>
    <a
      :class="['app-nav-burger', 'is-hidden-tablet', { 'is-active': mobileNavExpanded }]"
      v-show="navBurgerVisible"
    >
      <a @click="mobileNavExpanded = !mobileNavExpanded">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <button :class="['app-map-login', 'nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isScatterLoggingIn }]"
        @click="loginScatterAsync"
        v-if="!scatterAccount && appLogin"
      >
        {{$t('login')}}
      </button>
    </a>
    <slide-y-up-transition>
      <div class="app-nav-expand is-hidden-tablet" v-show="navBurgerVisible && mobileNavExpanded" @click="mobileNavExpanded=false"><!-- Nav Items on mobile -->
        <router-link class="app-nav-expand-item" to="/">{{$t('home')}}</router-link>
        <a class="app-nav-expand-item" @click="mobileAboutShow=!mobileAboutShow;"><b-icon class="question-icon" pack="fas" icon="question-circle" size="is-small"></b-icon>
{{' '+$t('about_view')}}</a>
        <a class="app-nav-expand-item" target="_blank" href="https://github.com/lowwor/fibos-sportsbet"><b-icon icon="github-circle" size="is-small" /> GitHub</a>
        <div class="app-nav-expand-item" @click.stop>
          <b-select class="is-inverted" v-model="$i18n.locale" icon="translate" :placeholder="$t('switch_lang')" size="is-small" rounded expanded>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
          </b-select>
        </div>
      </div>
    </slide-y-up-transition>
    <keep-alive include="map-view,globe-view"><router-view/></keep-alive>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Aboutview from '@/views/About.vue';
import API, { eos } from '@/util/api';
import Loading from '@/components/Loading.vue';

export default {
  name: 'App',
  components: {
    Loading,
    Aboutview,
  },
  data: () => ({
    mobileNavExpanded: false,
    aboutShow: false,
    globalCountdown: '00:00:00',
    mobileAboutShow: false,
    isRedeeming: false,
    appLogin: false,
  }),
  created() {
    this.countdownUpdater = setInterval(() => {
      if (this.globalInfo != null) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (currentTimestamp >= this.globalInfo.ed) {
          this.globalCountdown = 'ENDED';
        } else {
          let remaining = this.globalInfo.ed - currentTimestamp;
          const seconds = remaining % 60;
          remaining = Math.floor(remaining / 60);
          const minutes = remaining % 60;
          remaining = Math.floor(remaining / 60);
          const hours = remaining;
          this.globalCountdown = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
      }
    }, 1000);

  },
  methods: {
    ...mapActions(['connectScatterAsync', 'loginScatterAsync', 'logoutScatterAsync']),
    CloseAboutView() {
      this.aboutShow = !this.aboutShow;
    },
    CloseMobileAboutView() {
      this.mobileAboutShow = !this.mobileAboutShow;
    },
  },
  computed: {
    ...mapState(['isScatterConnected', 'scatterAccount', 'isScatterLoggingIn']),
    ...mapState('ui', ['navBurgerVisible', 'globalSpinnerVisible', 'globalProgressVisible', 'globalProgressValue']),
  },
  mounted() {
    this.connectScatterAsync();
  },
  beforeDestroy () {
  },
};
</script>

<style lang="sass">
@import "~bulma";
@import "~buefy/src/scss/buefy";
a:hover
  text-decoration: underline
.is-inverted > .select
  & select
    background: rgba(#000, 0.7)
    border-color: transparent
    color: #FFF
    &:hover
      border-color: rgba(#FFF, 0.4)
  &:not(.is-multiple):not(.is-loading):hover::after
    border-color: #FFF
.select select option
  color: #FFF
.modal-card
  box-shadow: 0 0 30px $primary
</style>

<style lang="sass" scoped>
#app
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: hidden
.app-nav
  position: absolute
  left: 2rem
  top: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: flex-start
.nav-item
  margin-right: 1rem
  color: rgba(#FFF, 0.8)
  user-select: none
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  &:hover
    color: #FFF
  &.router-link-exact-active
    color: $primary
.app-footer
  position: absolute
  left: 2rem
  right: 2rem
  bottom: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  a:hover
    text-decoration: none
.footer-item
  margin: 0 0.5rem
  font-size: $size-7
.app-nav-burger
  position: relative
  left: 0
  top: 0
  z-index: 5
  color: #FFF
  +hamburger($app-nav-height)
  cursor:auto
  a
    display: block
    color: #FFF
    width: 3rem
    height: 3rem
    cursor: pointer
.app-nav-expand
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 4
  background: rgba(#000, 0.9)
  padding-top: $app-nav-height
  &-item
    display: block
    width: 100%
    padding: 1rem
    border-top: 1px solid rgba(#FFF, 0.2)
    color: #FFF
    font-size: $size-7
    &:hover
      text-decoration: none
      background: rgba(#FFF, 0.1)
.country-detail
  position: absolute
  left: 0
  top: 0
  height: 100%
  z-index: 2
  pointer-events: none
  transition: background .5s ease-out
  width: 550px
  display: flex
  flex-direction: column
  &.is-active
    pointer-events: auto
    background: rgba(#000, 0.8)
  +mobile
    width: 100%
.mobile-back-button
  width: $app-nav-height
  height: $app-nav-height
  margin: 0
  display: flex
  justify-content: center
  align-items: center
.country-select
  +mobile
    margin: 0 0.5rem 0 0
    width: calc(100vw - #{$app-nav-height} - 0.5rem)
  .back-button
     position: absolute !important
     top: 2px  !important
     left: 10px  !important
.badgeList
  margin: 1rem 0
.app-map-login
    position: absolute
    left: 5rem
    top: .6rem
</style>

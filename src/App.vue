<template>
    <v-app dark>
        <v-navigation-drawer app
                             v-model="drawerToggle">
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Home</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar>
            <v-toolbar-side-icon @click.native.stop ="drawerToggle = !drawerToggle"></v-toolbar-side-icon>
            <v-toolbar-title>

            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="!scatterAccount">
                <v-btn flat @click="loginScatterAsync">Login
                </v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-if="isScatterConnected && scatterAccount">
                <v-btn flat @click="logoutScatterAsync">Logout
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <main>
            <router-view></router-view>
        </main>
        <v-footer height="auto" app>
            <v-card-text class="white--text">
                    {{$t('contract_creator')}}
                </v-card-text>
                <v-card-text class="white--text">
                    {{$t('powered_by')}} <a target="_blank" href="https://fibos.io/">FIBOS</a></v-card-text>
        </v-footer>
    </v-app>

</template>

<script>
import { mapActions, mapState } from 'vuex'
import API, { eos } from '@/util/api'
import Loading from '@/components/Loading.vue'

export default {
  name: 'App',
  components: {
    Loading,
  },
  data: () => ({
    drawerToggle: true,
    isRedeeming: false,
    appLogin: false
  }),
  created () {

  },
  methods: {
    ...mapActions(['connectScatterAsync', 'loginScatterAsync', 'logoutScatterAsync']),
  },
  computed: {
    ...mapState(['isScatterConnected', 'scatterAccount', 'isScatterLoggingIn']),
  },
  mounted () {
    this.connectScatterAsync()
  },
  beforeDestroy () {
  },
}
</script>

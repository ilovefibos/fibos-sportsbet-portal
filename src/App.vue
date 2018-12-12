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
        <v-toolbar app>
            <v-toolbar-side-icon @click.native.stop ="drawerToggle = !drawerToggle"></v-toolbar-side-icon>
            <v-toolbar-title>

            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="isScatterConnected && scatterAccount && !loadingActiveAuthority">
                <v-btn v-if="!hasGrantedPermission" flat @click="grantPermission">Grant Permission</v-btn>
                <v-btn v-else flat @click="removePermission">Remove Permission</v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-if="!scatterAccount">
                <v-btn flat @click="loginScatterAsync">Login
                </v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-if="isScatterConnected && scatterAccount">
                <v-btn flat @click="logoutScatterAsync">Logout
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer app>
            <v-card-text class="white--text">
                    {{$t('contract_creator')}}
                </v-card-text>
                <v-card-text class="white--text">
                    {{$t('powered_by')}} <a target="_blank" href="https://fibos.io/">FIBOS</a></v-card-text>
        </v-footer>
    </v-app>

</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import API, { eos } from '@/util/api'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    drawerToggle: true,
    isRedeeming: false,
    appLogin: false
  }),
  created () {

  },
  methods: {
    ...mapActions(['connectScatterAsync', 'loginScatterAsync', 'logoutScatterAsync', 'grantPermission', 'removePermission']),
  },
  computed: {
    ...mapState(['isScatterConnected', 'scatterAccount', 'isScatterLoggingIn','loadingActiveAuthority']),
    ...mapGetters(['hasGrantedPermission'])
  },
  mounted () {
    this.connectScatterAsync()
  },
  beforeDestroy () {
  },
}
</script>


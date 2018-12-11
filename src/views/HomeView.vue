<template>
    <div class="home">
            <v-data-table  v-if="$vuetify.breakpoint.smAndUp"
                    :headers="headers"
                    :items="events"
            >
                <template slot="items" slot-scope="props">
                    <td class="small-td"><div class="normal-column-container">{{ props.item.league }}</div>
                    </td>
                    <td><div class="normal-column-container">{{ props.item.home }}</div></td>
                    <td><div class="normal-column-container">{{ props.item.away }}</div></td>
                    <td><div class="normal-column-container">{{ new Date(parseInt(props.item.start_time)) | moment("MMMM Do YYYY, hh:mm:ss") }}</div></td>
                    <td class="odds-td">
                        <div class="odds-column-container">
                            <div class="odds-box back-box" @click="onClickBet(props, '1b')">{{props.item.homeBack
                                /10000}}
                            </div>
                            <div class="odds-box lay-box" @click="onClickBet(props, '1l')"> {{props.item.homeLay /10000}}</div>
                        </div>
                    </td>
                    <td class="odds-td">
                        <div class="odds-column-container">
                            <div class="odds-box back-box" @click="onClickBet(props, 'xb')">{{props.item.drawBack
                                /10000}}
                            </div>
                            <div class="odds-box lay-box"  @click="onClickBet(props, 'xl')">{{props.item.drawLay /10000}}</div>
                        </div>
                    </td>
                    <td class="odds-td">
                        <div class="odds-column-container">
                            <div class="odds-box back-box" @click="onClickBet(props, '2b')">{{props.item.awayBack
                                /10000}}
                            </div>
                            <div class="odds-box lay-box"  @click="onClickBet(props, '2l')"> {{props.item.awayLay /10000}}</div>
                        </div>
                    </td>
                </template>
            </v-data-table>
            <v-data-iterator v-else
                             :items="events">
                <template slot="item" slot-scope="props">
                    <v-card class="iterator-event-container">
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[0].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.league }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[1].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.home }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[2].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ props.item.away }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[3].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ new Date(parseInt(props.item.start_time)) | moment("MMMM Do YYYY, hh:mm:ss") }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[4].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end"> <div class="odds-column-container">
                                    <div class="odds-box back-box" @click="onClickBet(props, '1b')">{{props.item.homeBack
                                        /10000}}
                                    </div>
                                    <div class="odds-box lay-box" @click="onClickBet(props, '1l')"> {{props.item.homeLay /10000}}</div>
                                </div></v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[5].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end"> <div class="odds-column-container">
                                    <div class="odds-box back-box" @click="onClickBet(props, 'xb')">{{props.item.drawBack
                                        /10000}}
                                    </div>
                                    <div class="odds-box lay-box"  @click="onClickBet(props, 'xl')">{{props.item.drawLay /10000}}</div>
                                </div></v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>{{headers[6].text}}:</v-list-tile-content>
                                <v-list-tile-content class="align-end"> <div class="odds-column-container">
                                    <div class="odds-box back-box" @click="onClickBet(props, '2b')">{{props.item.awayBack
                                        /10000}}
                                    </div>
                                    <div class="odds-box lay-box"  @click="onClickBet(props, '2l')"> {{props.item.awayLay /10000}}</div>
                                </div></v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </template>
            </v-data-iterator>
        <v-dialog light
                v-model="showDialog"
                  width="500"
        >
            <div class="place-bet-container">
                <p class="place-bet-desc">{{bettingEvent.side.indexOf('b') !== -1? 'Back': 'Lay'}} (Bet {{bettingEvent.side.indexOf('b')!== -1?
                    'For': 'Against'}})</p>
                <p class="place-bet-desc">{{getSideDesc(bettingEvent.event,bettingEvent.side)}} Match Odds</p>

                <div class="place-bet-input-container">
                    <v-text-field type="number" v-model="bettingEvent.odds" class="place-bet-input" height="30px"
                                  hide-details outline :value="bettingEvent.odds" label="Odds"></v-text-field>
                    <v-text-field type="number" v-model="bettingEvent.stake" class="place-bet-input" height="30px"
                                  hide-details outline label="Stake"></v-text-field>
                </div>
                <div>
                    <v-btn color="success" @click="makeOffer">Place Bet</v-btn>
                </div>
            </div>

        </v-dialog>
        </div>
</template>

<script>

import { mapState } from 'vuex'
import { setLocalStorage, removeLocalStorage } from '@/util/storeUtil.js'
import API from '../util/api'
import _ from 'lodash'

export default {
  name: 'home-view',
  data () {
    return {
      events: [],
      offers: [],
      showDialog: false,
      bettingEvent: {
        event:{},
        side:'',
        isBack: true,
        odds: 1,
        stake: 0
      },
      headers: [
        {text: 'League', align: 'center', value: 'league'},
        {text: 'Home', align: 'center', value: 'home', width: '80px', sortable: false},
        {text: 'Away', align: 'center', value: 'away', width: '80px', sortable: false},
        {text: 'Start Time', align: 'center', value: 'start_time'},
        {text: '1', value: '1', align: 'center', width: '60px', sortable: false},
        {text: 'x', value: 'x', align:'center', width:'60px', sortable: false},
        {text: '2', value: '2', align:'center', width:'60px', sortable: false}
      ],
    }
  },
  components: {
  },
  computed: {
    ...mapState(['isScatterConnected', 'scatterAccount'])
  },
  watch: {
    scatterAccount (val) {
      if (val) {
        this.coreLogin(val)
      }
    },
  },
  async created () {
    setInterval(async () => {
      const events = await API.getEvents()
      const offers = await API.getOffers()
      events.forEach(event => {
        const chooseGroup = _.groupBy(offers, 'maker_bet_choose')
        event.homeLay = chooseGroup['1l'] ? _.sortBy(chooseGroup['1l'], ['maker_stakes'])[0].maker_odds : 0
        event.drawLay = chooseGroup.xl ? _.sortBy(chooseGroup.xl, ['maker_stakes'])[0].maker_odds : 0
        event.awayLay = chooseGroup['2l'] ? _.sortBy(chooseGroup['2l'], ['maker_stakes'])[0].maker_odds : 0
        event.homeBack = chooseGroup['1b'] ? _.sortBy(chooseGroup['1b'], ['maker_stakes'])[0].maker_odds : 0
        event.drawBack = chooseGroup.xb ? _.sortBy(chooseGroup.xb, ['maker_stakes'])[0].maker_odds : 0
        event.awayBack = chooseGroup['2b'] ? _.sortBy(chooseGroup['2b'], ['maker_stakes'])[0].maker_odds : 0
      })


      const myBets = await API.getMyBets()
      const myOffers = await API.getMyOffers()

      this.events = events
    }, 3000)
  },
  mounted () {
  },
  methods: {
    coreLogin (account) {
      if (!account || !account.name) {
        return false
      }
    },
    onClickBet(props, side, odds) {
      console.log(props, side, odds)
      const event = props.item
      if (!props.expanded) {
        props.expanded = !props.expanded
      } else if (event.id !== this.bettingEvent.event.id) {
        props.expanded = !props.expanded
      } else if (side === this.bettingEvent.side) {
        props.expanded = !props.expanded
      }
      this.bettingEvent.event = event
      this.bettingEvent.side = side
      this.bettingEvent.isBack = side.indexOf('b') !== -1
      if (side === '1l') {
        this.bettingEvent.odds = event.homeLay / 10000
      } else if (side === '1b') {
        this.bettingEvent.odds = event.homeBack / 10000
      } else if (side === 'xl') {
        this.bettingEvent.odds = event.drawLay / 10000
      } else if (side === 'xb') {
        this.bettingEvent.odds = event.drawBack / 10000
      } else if (side === '2l') {
        this.bettingEvent.odds = event.awayLay / 10000
      } else if (side === '2b') {
        this.bettingEvent.odds = event.awayBack / 10000
      }
      this.bettingEvent.stake = ''
      this.showDialog = true
      console.log(this.bettingEvent)
    },
    async makeOffer() {
      try {
        const offerResult = await API.makeOffer(
          this.bettingEvent.event.id, this.bettingEvent.stake,
          this.bettingEvent.side, this.bettingEvent.odds
        )
        this.$toasted.success('Successfully place bet!', {duration: 3000})
      } catch (e) {
        console.log(e)
        this.$toasted.error(`Failed to place bet: ${e.message}.`, {duration: 3000})
      }
      this.showDialog = false
    },
    getSideDesc(event, side) {
      if (side === '1l' || side === '1b') {
        return event.home.toUpperCase()
      } else if (side === 'xl' || side === 'xb') {
        return 'DRAW'
      } else if (side === '2l' || side === '2b') {
        return event.away.toUpperCase()
      }
    }
  },
  destroyed () {

  },
}
</script>

<style lang="scss" scoped>

    .iterator-event-container{
        margin-top: 20px;
    }

    .home {
        margin-top: 20px;
        & /deep/ .small-td{
            padding: 0;
        }

        & /deep/ .odds-td{
            padding: 0;
        }
    }


    .normal-column-container{

        display: flex;
        justify-content:center;
        align-items: center;
    }

    .odds-column-container{
        display: flex;
        justify-content:center;
        align-items: center;
        margin: 8px;
        .odds-box{
            min-width: 50px;
            line-height: 40px;
            text-align: center;
            margin: 4px;
        }

        .lay-box{
            background: tomato;
        }

        .back-box{
            background: aquamarine;
        }
    }

    .place-bet-container{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
        text-align: center;
        background: white;

        .place-bet-desc{
            color: tomato;
        }

        .place-bet-input-container{
            display: flex;

        }

        & /deep/ .place-bet-input{
            width: 100px;
            margin-right: 10px;
        }

    }

</style>

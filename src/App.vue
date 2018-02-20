<template>
    <v-app>
        <v-toolbar absolute :color="IsAdminPage? 'primary': ''" :dark="IsAdminPage? true: false" :flat="!IsAdminPage? true: false"clipped-left app>
            <v-toolbar-title><v-btn flat to="/" style="font-weight:500">Blaise Scientific Trading</v-btn></v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="!IsAdminPage">
                <v-btn flat to="/quotations" v-if="IsAuthenticated"><v-icon left>receipt</v-icon>Quotations</v-btn>
                <v-btn flat to="/Products"><v-icon left>list</v-icon>Products</v-btn>
                <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu2">
                  <v-btn slot="activator" flat>
                    <v-badge color="error" left v-if="ShoppingCart.Items.length>0"> <span slot="badge">{{ShoppingCart.Items.length}}</span>
                    <v-icon left>shopping_cart</v-icon> </v-badge>  <v-icon left v-if="ShoppingCart.Items.length<=0">shopping_cart</v-icon> Cart
                  </v-btn>
                    <v-card>
                        <template v-if="ShoppingCart.Items.length <= 0">
                          <v-card-text>
                            <p>No items in cart</p>
                          </v-card-text>
                        </template>
                        <v-list two-line>
                          <template v-for = "item in ShoppingCart.Items">
                            <v-list-tile avatar>
                              <v-list-tile-avatar>
                                <img :src="item.Images[0]"/>
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="item.Name"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.SKU"></v-list-tile-sub-title>
                              </v-list-tile-content>
                              <v-list-tile-action>
                                  <v-list-tile-action-text>
                                       {{item.Quantity}} items
                                  </v-list-tile-action-text>
                                  <v-btn icon flat @click="removeShoppingCart(item._id)"><v-icon>remove</v-icon></v-btn>
                              </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                          </template>
                        </v-list>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                       <v-btn flat color="primary" :disabled="!IsAuthenticated" v-if="ShoppingCart.Items.length>0" @click="requestQuotation">Request a Quote</v-btn>
                      <v-btn flat color="orange" to="/ShoppingCart">Explore</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <template v-if="!IsAuthenticated">
                    <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu">
                        <v-btn slot="activator" flat><v-icon left>account_box</v-icon>Account</v-btn>
                        <v-card>
                            <v-list>
                                <v-divider></v-divider>
                                <v-list-tile to="/signup">
                                    <v-list-tile-content>
                                         <v-list-tile-title>Sign Up</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action><v-icon>person_add</v-icon></v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile to="/signin">
                                    <v-list-tile-content>
                                        <v-list-tile-title>Sign In</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action><v-icon>input</v-icon></v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
                <template v-if="IsAuthenticated">
                    <template v-if="!IsAdminPage">
                        <v-btn flat icon disabled>
                            <v-avatar size="40px">
                                <img :src="User.ProfileImage" />
                            </v-avatar>
                        </v-btn>
                         <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu">
                            <v-btn slot="activator" flat>{{User.Name}}</v-btn>
                            <v-card>
                                <v-list>
                                    <v-list-tile to="/transactions">
                                        <v-list-tile-content>
                                            <v-list-tile-title>My Transactions</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action><v-icon>credit_card</v-icon></v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile @click="Logout">
                                        <v-list-tile-content>
                                             <v-list-tile-title>Log Out</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action><v-icon>reply</v-icon></v-list-tile-action>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </template>
                </template>
            </template>
            <template v-if="IsAdminPage">
                    <v-btn flat icon disabled>
                        <v-avatar size="40px">
                            <img :src="User.ProfileImage" />
                        </v-avatar>
                    </v-btn>
                    <v-btn flat>
                        {{User.Name}}
                    </v-btn>
                </template>
        </v-toolbar>
        <v-navigation-drawer v-if="IsAdminPage" fixed clipped app :mini-variant.sync="mini">
            <v-toolbar flat class="transparent">
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img :src="User.ProfileImage" />
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{User.Name}}</v-list-tile-title>
                            <v-list-tile-sub-title><span v-html="User.AccessLevel===1?'Administrator':User.AccessLevel===2? 'Sales Manager': 'Sales Agent'"></span></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon @click.native.stop="mini = !mini"><v-icon>chevron_left</v-icon></v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
              <v-list-tile slot="item" @click="item.active = !item.active">
                <v-list-tile-action>
                    <template v-if="item.notify">
                        <v-badge color="red">
                            <span slot="badge">!</span>
                            <v-icon>{{ item.action }}</v-icon>
                        </v-badge>
                    </template>
                    <template v-if="!item.notify">
                            <v-icon>{{ item.action }}</v-icon>
                    </template>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="subItem.href" @click.native="doAction(subItem.method)">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>{{ subItem.action }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
        </v-navigation-drawer>
        <v-content>
             <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" top v-model="Snackbar">{{Message}} <v-icon color="red">{{snackbar.actions}}</v-icon></v-snackbar>
            <main>
                <router-view/>
            </main>
        </v-content>
    </v-app>
</template>
<script>
import Uuid from 'uuid-lib'
import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      quotations: [],
      menu2: false,
      sideNav: false,
      menu: false,
      IsAuthenticated: false,
      IsAdminPage: false,
      mini: true,
      items: [
          {
            action: 'loyalty',
            title: 'Product Management',
            active: false,
            items: [
              { title: 'Products', href: '/admin/product', action: 'list', method: '' }
            ]
          },
          {
            action: 'credit_card',
            title: 'Transaction Management',
            active: false,
            items: [
              { title: 'Quotation', href: '/admin/quotation', action: 'attach_money', method: '' }
            ]
          },
          {
              action: 'people',
              title: 'User Management',
              active: false,
              items: [
                  {title: 'User Accounts', href: '/admin/user', action: 'person', method: ''},
                  {title: 'Log out', href:'/logout', action: 'reply', method: 'logout'}
              ]
          }
        ],
      snackbar: {
          timeout: 6000,
          color: '',
          actions: ''
      },
      Snackbar: false,
      Message: ''
    }
  },
  computed: {
    User () {
      return this.$store.getters.getUser
    },
    ShoppingCart () {
      return this.$store.getters.getShoppingCart
    }
  },
  mounted () {
    var url = ''
    if (localStorage.getItem('Token')) {
      this.$store.dispatch('jwtdecode', localStorage.getItem('Token'))
    }
    localStorage.setItem('Context','5a43354f1a070f28107f806a')
    this.$store.dispatch('setDefaultUser')
    this.$store.dispatch('setShoppinCart')
    axios.get('http://ip-api.com/json')
      .then(response =>{
        axios.post('http://localhost:4000/api/v1/city', { Name: response.data.city })
            .catch(err => {

        })
        axios.post('http://localhost:4000/api/v1/country', {Name: response.data.country })
            .catch(err => {

            })
        axios.post('http://localhost:4000/api/v1/state', {Name: response.data.regionName })
            .catch(err => {

            })
    })
    this.startCycle()
  },
  watch: {
    User (value) {
      if (value.AuthCode != null && value.AuthCode != undefined) {
        this.IsAuthenticated = true

        if (value.AccessLevel != 4) {
          this.IsAdminPage = true
        }
      }
      else {
        this.IsAuthenticated = false
      }
    }
  },
  methods: {
    doAction (value) {
        if (value === 'logout') {
            this.Logout()
        }
    },
    Logout () {
      this.$store.dispatch('logout')
      localStorage.removeItem('Token')
      localStorage.removeItem('AuthCode')
      localStorage.removeItem('forAdmin')
      localStorage.removeItem('ContactId')
      localStorage.removeItem('ConfirmEmail')
      localStorage.removeItem('IsAuthenticated')
      localStorage.removeItem('UserId')
      this.$router.push('/signin')
      this.IsAdminPage =false
    },
    removeShoppingCart (value) {
      this.$store.dispatch('removeItemInCart',value)
    },
    requestQuotation () {
      this.$store.dispatch('requestForQoutation')
    },
    getQuotationByUser () {
      axios({
        method: 'get',
        url: 'http://localhost:3002/api/v1/quotation/quote/' + this.$store.getters.getShoppingCart.UserId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.quotations = response.data.items
        })
    },
    startCycle () {
        setInterval(function() {
            this.refreshAllData()
        }.bind(this),30000)
    },
    refreshAllData () {
        var admin = localStorage.getItem('forAdmin')
        var isAuth = localStorage.getItem('Token')
        if (admin) {
            axios({
                method: 'get',
                url: 'http://localhost:3002/api/v1/quotation/new',
                headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
            .then(response => {
                 if (response.data.totalcount > 0) {
                     this.snackbar.color = 'gray'
                     this.snackbar.actions = 'priority_high'
                     this.Message = 'There is ' + response.data.items.length + ' new quotation request' 
                     this.Snackbar = !this.Snackbar
                 }
            })
        }
        if (isAuth === null || isAuth === undefined || !admin) {
        }
        else {
            console.log('shit pa')
            axios({
                method: 'get',
                url: 'http://localhost:3002/api/v1/quotation/quote/' + localStorage.getItem('UserId'),
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
            .then(response => {
                if (response.data.totalcount > 0) {
                    this.snackbar.color = 'gray'
                    this.snackbar.actions = 'priority_high'
                    this.Message = 'There is ' + response.data.totalcount + ' new quoted request' 
                    this.Snackbar = !this.Snackbar
                }
            })
        }
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
    list-style: none;
}
</style>

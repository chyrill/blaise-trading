<template>
<v-app>
  
  <v-toolbar  dark color="primary">
    <v-toolbar-title>Blaise Scientific Trading</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items  color="primary" v-if="!IsAdminPage" class="hidden-md-and-down">

      <v-btn  v-if="IsAuthenticated" dark color="primary" to="/quotations">
        <v-badge color="error" left v-if="quotations.length>0"><span slot="badge"><v-icon>error</v-icon></span>
        <v-icon left>receipt</v-icon> </v-badge> <v-icon v-if="IsAuthenticated && quotations.length<1">receipt</v-icon>Quotations
      </v-btn >
      <v-btn  dark color="primary" to="/Products">
        <v-icon left>list</v-icon> Products
      </v-btn >
      <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="250" v-model="menu2">
      <v-btn slot="activator" color="primary">
        <v-badge color="error" left v-if="ShoppingCart.Items.length>0"> <span slot="badge">{{ShoppingCart.Items.length}}</span>
        <v-icon left>shopping_cart</v-icon> </v-badge>  <v-icon left v-if="ShoppingCart.Items.length<=0">shopping_cart</v-icon> Cart
      </v-btn>
      <v-card>
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
                  {{item.Quantity}} items
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
      <v-menu offset-y :offset-overflow="true" :close-on-content-click="false" :nudge-width="200" v-model="menu">
        <v-btn   slot="activator"  color="primary">
          <v-icon left>account_box</v-icon> Account</v-btn>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <div v-if="IsAuthenticated">
                  <img :src="User.ProfilePicture" />
                </div>
                <div v-else>
                  <v-icon>account_circle</v-icon>
                </div>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <div v-if="IsAuthenticated">
                  <v-list-tile-title>{{User.Name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{User.Others.PhoneNumber}}</v-list-tile-sub-title>
                </div>
                <div v-else>
                  <v-list-tile-title>Guest</v-list-tile-title>
                  <v-list-tile-sub-title>No Contact Number</v-list-tile-sub-title>
                </div>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon :class="IsAuthenticated? 'red--text':''">
                  <v-icon>vpn_key</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <div v-if="!IsAuthenticated">
              <v-list-tile avatar to="/signup">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Sign Up</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>person_add</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile avatar to="/signin">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Log In</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>lock_open</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </div>
            <div v-else>
              <v-list-tile avatar @click="Logout">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Log out</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon>
                    <v-icon>reply</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </div>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar-side-icon v-if="!IsAdminPage" class="hidden-md-and-up" @click.stop="sideNav=!sideNav">
    </v-toolbar-side-icon>
    <v-toolbar-side-icon v-if="IsAdminPage"  @click.stop="sideNav=!sideNav">
    </v-toolbar-side-icon>
  </v-toolbar>
<v-navigation-drawer  fixed clipped="false" permanent v-if="IsAdminPage" :mini-variant="mini" @click="mini=!mini">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="User.ProfilePicture" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{User.Name}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-toolbar>
        <v-divider></v-divider>
        <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
              <v-list-tile slot="item" @click="item.active = !item.active">
                <v-list-tile-action>
                  <v-icon>{{ item.action }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="subItem.href" @click.native="sideNav=!sideNav">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>{{ subItem.action }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
            <v-list>
              <v-btn flat @click="Logout">
              <v-list-tile  >
                <v-list-tile-content>
                  <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-icon>reply</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-btn>
            </v-list>
  </v-navigation-drawer>
<v-content>
    <main>
    <router-view/>
  </main>
</v-content>
</v-app>
</template>
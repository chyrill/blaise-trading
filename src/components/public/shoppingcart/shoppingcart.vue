<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
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
              <v-btn flat color="primary" v-if="ShoppingCart.Items.length>0" @click="requestQuotation">Request a Quote</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12>
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>Purchasing Procedure</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs3>
                            <v-card style="height:400px">
                                <v-layout>
                                    <v-flex>
                                         <img src="http://1510ec71.ngrok.io/uploads/shopping_cart-1517184384368.png" style="height:200px" />
                                    </v-flex>
                                </v-layout>
                                <v-card-title>
                                    <h2>Add Product</h2>
                                </v-card-title>
                                <v-card-text>
                                    <p>Select, review and add the product to the cart.</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                         <v-flex xs3>
                            <v-card style="height:400px">
                                <v-layout>
                                    <v-flex>
                                         <img src="http://1510ec71.ngrok.io/uploads/quote-1517184907856.png" style="height:200px" />
                                    </v-flex>
                                </v-layout>
                                <v-card-title>
                                    <h2>Request Quotation</h2>
                                </v-card-title>
                                <v-card-text>
                                    <p>Request for quotation of product. Once received you can proceed to purchase or reconsideration of budget for quotation.</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs3>
                            <v-card style="height:400px">
                                <v-layout>
                                    <v-flex>
                                         <img src="http://1510ec71.ngrok.io/uploads/payment-512-1517186086810.png" style="height:200px" />
                                    </v-flex>
                                </v-layout>
                                <v-card-title>
                                    <h2>Purchase Product</h2>
                                </v-card-title>
                                <v-card-text>
                                    <p>Purchase the quotation sent. Pay the total amount to proceed in delivery of the product.</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs3>
                            <v-card style="height:400px">
                                <v-layout>
                                    <v-flex>
                                         <img src="http://1510ec71.ngrok.io/uploads/Express_Shipping-512-1517186199983.png" style="height:200px" />
                                    </v-flex>
                                </v-layout>
                                <v-card-title>
                                    <h2>Delivery of Product</h2>
                                </v-card-title>
                                <v-card-text>
                                    <p>Purchase the quotation sent. Pay the total amount to proceed in delivery of the product.</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</template>

<script>

export default {
  data () {
    return {
      IsAuthenticated: localStorage.getItem('IsAuthenticated')
    }
  },
  computed:{
    ShoppingCart () {
      return this.$store.getters.getShoppingCart
    },
    User () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    removeShoppingCart (value) {
      this.$store.dispatch('removeItemInCart',value)
    },
    requestQuotation () {
      this.$store.dispatch('requestForQoutation')
    }
  }
}
</script>

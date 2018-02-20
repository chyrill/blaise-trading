<template>
    <v-container>
        <v-card>
            <v-tabs fixed icons centered>
                <v-toolbar color="primary" dark>
                    <v-toolbar-title>Quotation Management</v-toolbar-title>
                    <v-tabs-bar dark color="primary" slot="extension">
                        <v-tabs-slider color="grey"></v-tabs-slider>
                        <v-tabs-item href="#new">
                            <v-icon>fiber_new</v-icon>
                            New Request
                        </v-tabs-item>
                        <v-tabs-item href="#quoted">
                            <v-icon>receipt</v-icon>
                            Quoted
                        </v-tabs-item>
                        <v-tabs-item href="#approve">
                            <v-icon>check</v-icon>
                            approved
                        </v-tabs-item>
                    </v-tabs-bar>
                  </v-toolbar>
                <v-tabs-items>
<!--                    new tab-->
                    <v-tabs-content id="new">
                        <v-card-text>
                            <v-flex xs10 offset-xs1>
                                <v-data-table v-bind:headers="Newheaders" :items="newquotations" hide-actions class="elevation-2">
                                    <template slot="items" slot-scope="props">
                                        <td>{{props.item.CreatedBy}}</td>
                                        <td>{{props.item.DateCreated}}</td>
                                        <td><v-btn icon flat @click="openEditDialog(props.item._id)"><v-icon>mode_edit</v-icon></v-btn></td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-card-text>
                    </v-tabs-content>
<!--                    end new tab-->
<!--                     quoted tab-->
                    <v-tabs-content id="quoted">
                        <v-card-text>
                            <v-flex xs10 offset-xs1>
                                <v-data-table v-bind:headers="Quotedheaders" :items="quotedquotations" hide-actions class="elevation-2">
                                    <template slot="items" slot-scope="props">
                                        <td>{{props.item.CreatedBy}}</td>
                                        <td>{{props.item.DateCreated}}</td>
                                        <td>{{props.item.TotalQuote}}</td>
                                        <td>{{props.item.DateUpdated}}</td>
                                        <td><v-btn icon flat @click="openEditDialog(props.item._id)"><v-icon>mode_edit</v-icon></v-btn></td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-card-text>
                    </v-tabs-content>
<!--   quoted tab-->
<!-- approved tab-->
                    <v-tabs-content id="approve">
                        <v-card-text>
                            <v-flex xs10 offset-xs1>
                                <v-data-table v-bind:headers="Approvedheaders" :items="approvedquotations" hide-actions class="elevation-2">
                                    <template slot="items" slot-scope="props">
                                        <td>{{props.item.CreatedBy}}</td>
                                        <td>{{props.item.DateCreated}}</td>
                                        <td>{{props.item.TotalQuote}}</td>
                                        <td>{{props.item.DateUpdated}}</td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-card-text>
                    </v-tabs-content>
<!--end of approved tab-->
                </v-tabs-items>
            </v-tabs>
        </v-card>
        
      
<!--   editViewDialog -->
    <v-dialog v-model="editViewDialog" max-width="800px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Quotation Information</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                    <v-card-text>
                      <v-container>
                        <v-layout row wrap>
                          <v-flex xs4 offset-xs1 style="text-align:justify">
                            <p><b>Customer Name:</b>  {{quotationItem.CreatedBy}}</p>
                          </v-flex>
                          <v-flex xs4 offset-xs1 style="text-align:justify">
                            <p><b>Company Name:</b>  {{otherInformation.CompanyName}}</p>
                          </v-flex>
                          <v-flex xs4 offset-xs1 style="text-align:justify">
                            <p><b>Company Sector: </b>  {{otherInformation.Sector}}</p>
                          </v-flex>
                          <v-flex xs4 offset-xs1 style="text-align:justify">
                            <p><b>Date Created:</b>  {{quotationItem.DateCreated}}</p>
                          </v-flex>
                          <v-flex>
                              <v-btn color="indigo" @click="exchangeDialog=!exchangeDialog" dark>See Exchange Rate</v-btn>
                          </v-flex>
                          <v-flex xs10 offset-xs1>
                              <v-layout row wrap>
                                  <v-flex xs6 offset-xs1>
                                      <v-slider label="Mark Up" v-bind:max="100" v-model="MarkUp" @input="markUpChange"></v-slider>
                                  </v-flex>
                                  <v-flex xs2 offset-xs1>
                                      <v-text-field v-model="MarkUp" disabled></v-text-field>
                                  </v-flex>
                              </v-layout>
                          </v-flex>
                          <v-flex xs10 offset-xs1>
                              <v-layout row wrap>
                                 <v-flex xs2 style="text-align:center">
                                    <p><h3>Product Name</h3> </p>
                                  </v-flex>
                                  <v-flex xs2 style="text-align:center">
                                    <p><h3>Quantity</h3> </p>
                                  </v-flex>
                                  <v-flex xs2 style="text-align:center">
                                    <p><h3>Original Price</h3> </p>
                                  </v-flex>
                                  <v-flex xs2 style="text-align:center">
                                    <p><h3>Unit Price (PHP)</h3> </p>
                                  </v-flex>
                                  <v-flex xs2 style="text-align:center">
                                    <p><h3>Price (PHP)</h3></p>
                                  </v-flex>
                             </v-layout>
                          </v-flex>
                          <template v-for="item in quotationItem.Items">
                          <v-flex xs10 offset-xs1>
                            <v-layout row wrap>
                              <v-flex xs2>
                                <b>{{item.Name}} </b>
                              </v-flex>
                              <v-flex xs2>
                                {{item.Quantity}} items
                              </v-flex>
                              <v-flex xs2>
                                {{item.Price.Amount}} {{item.Price.Currency}}
                              </v-flex>
                              <v-flex xs2>
                                  {{item.UnitPrice}}
                              </v-flex>
                              <v-flex xs2>
                                <v-text-field type="number" label="Amount" v-model="item.TotalAmount"  @keyup="getTotalQuote"/>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </template>
                        <v-flex xs4 offset-xs8>
                          <p><b>Amount: </b>{{totalQuote}}</p>
                        </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="submit()">Submit Quotation</v-btn>
                       <v-btn flat color="error" @click="editViewDialog=!editViewDialog">Close</v-btn>
                    </v-card-actions>
                   </v-card>
                 </v-dialog>
<!--end of viewDialog -->
            <!-- dialog box exchange rate-->
                <v-dialog v-model="exchangeDialog" max-width="500">
                    <v-card>
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>Exchange Rates</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon flat dark @click="exchangeDialog=!exchangeDialog"><v-icon>clear</v-icon></v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-flex xs12>
                                <h3>Base: Peso (PHP)</h3>
                            </v-flex>
                            <v-flex xs12 v-for="(value, propName) in Currencies">
                                <v-text-field :label="propName" :value="value" disabled/>
                            </v-flex>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            <!--end of dialog box-->
                 <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} <v-icon>{{snackbar.action}}</v-icon></v-snackbar>
  </v-container>
</template>



<script>
import axios from 'axios'

export default {
  data () {
    return {
      quotedquotations: [],
      approvedquotations: [],
      newquotations: [],
      exchangeDialog: false,
      MarkUp: 0,
      Errors: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        color: '',
        action: ''
      },
      editItemId: '',
      editViewDialog: false,
      items: [],
      Newheaders: [
        {
          text: 'Customer Name',
          align: 'center',
          value: 'CreatedBy'
        },
        {
          text: 'Date Applied',
           align: 'center',
           value: 'DateCreated'
        },
        {
           sortable: false
        }
      ],
      Quotedheaders: [
          {
              text: 'Customer Name',
              align: 'center',
              value: 'CreatedBy'
          },
          {
              text: 'Date Applied',
              align: 'center',
              value: 'DateCreated'
          },
          {
              text: 'Total Amount (PHP)',
              align: 'center',
              value: 'TotalQuote'
          },
          {
              text: 'Date Quoted',
              align: 'center',
              value: 'DateUpdated'
          },
          {
              sortable: false
          }
      ],
      Approvedheaders: [
          {
              text: 'Customer Name',
              align: 'center',
              value: 'CreatedBy'
          },
          {
              text: 'Date Applied',
              align: 'center',
              value: 'DateCreated'
          },
          {
              text: 'Total Amount (PHP)',
              align: 'center',
              value: 'TotalQuote'
          },
          {
              text: 'Date Approved',
              align: 'center',
              value: 'DateUpdated'
          },
          {
              sortable: false
          }
      ],
      quotationItem: {},
      otherInformation: {},
      totalQuote: 0,
      Currencies: {}
    }
  },
  mounted () {
    this.getQuotation()
    this.getCurrency()
  },
  methods: {
    getQuotation () {
        axios({
            method: 'get',
            url: 'http://8f466630.ngrok.io/api/v1/quotation',
            params: {
                Filters: 'Status:/new/'   
            },
            headers: {
              'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
            }
          })
        .then(response => {
          this.newquotations = response.data.items
        })
        
        axios({
            method: 'get',
            url: 'http://8f466630.ngrok.io/api/v1/quotation',
            params: {
                Filters: 'Status:/Quoted/'   
            },
            headers: {
              'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
            }
          })
        .then(response => {
           
          this.quotedquotations = response.data.items
        })
        
        axios({
            method: 'get',
            url: 'http://8f466630.ngrok.io/api/v1/quotation',
            params: {
                Filters: 'Status:/Approved/'   
            },
            headers: {
              'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
            }
          })
        .then(response => {
          this.approvedquotations = response.data.items
        })
    },
    getTotalQuote () {
      this.quotationItem['TotalQuote'] = 0
      this.totalQuote = 0
      for (let item in this.quotationItem.Items) {
        var amount= parseFloat(this.quotationItem.Items[item].TotalAmount)
        var qoute= parseFloat(this.totalQuote)
        this.totalQuote = qoute + amount
        this.quotationItem.TotalQuote = this.totalQuote
      }
    },
    submit () {
      this.quotationItem['TotalQuote'] = this.totalQuote
      axios({
        method: 'put',
        url: 'http://8f466630.ngrok.io/api/v1/quotation/quote',
        data: this.quotationItem,
        headers: {
          'Authorization' : 'Bearer ' + this.$store.getters.getAuthCode
        }
      }).
        then(response =>{
          this.getQuotation()
          this.editItemId = ''
          this.editViewDialog = !this.editViewDialog
          this.Errors = 'Successfully submitted quotation'
          this.snackbar.action = 'check'
          this.snackbar.color = 'green'
          this.Snackbar = !this.Snackbar
          this.sendNotification(this.quotationItem)
        })
        .catch(err=>{
          this.Errors = err.response.data.message
          this.snackbar.action = 'close'
          this.snackbar.color = 'red'
          this.Snackbar = !this.Snackbar
        })
    },
    openEditDialog (value) {
      this.editItemId = value
      this.editViewDialog = !this.editViewDialog
      this.getQuotationById()
    },
    getQuotationById () {
      axios({
        method: 'get',
        url: 'http://8f466630.ngrok.io/api/v1/quotation/' + this.editItemId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.quotationItem = response.data.model
          this.otherInformation = response.data.model.Customer.Others
          if (this.otherInformation.Sector === 'Government') {
              this.MarkUp = 50
          }
          else {
              this.MarkUp = 100
          }
          for (let item in this.quotationItem.Items) {
            var exchangeRate = this.Currencies[this.quotationItem.Items[item].Price.Currency]
            var price =  parseFloat(this.quotationItem.Items[item].Price.Amount).toFixed(2)
            var markup = parseFloat(this.MarkUp/100).toFixed(2)
            this.quotationItem.Items[item]['UnitPrice'] = parseFloat(parseFloat(parseFloat(parseFloat(price) + parseFloat(price * markup))/exchangeRate) + parseFloat(parseFloat(parseFloat(parseFloat(price) + parseFloat(price * markup))/exchangeRate) * .12)).toFixed(2)
            this.quotationItem.Items[item]['TotalAmount'] =  parseFloat(parseFloat(this.quotationItem.Items[item]['UnitPrice'])  * this.quotationItem.Items[item].Quantity).toFixed(2)
            this.totalQuote = parseFloat(this.totalQuote + this.quotationItem.Items[item]['TotalAmount']).toFixed(2)
          }
          
        })
    },
    getCurrency () {
        axios({
          method: 'get',
          url: 'https://api.fixer.io/latest?base=PHP'
        })
        .then(response =>{
            this.Currencies = response.data.rates;
        })
    },
    markUpChange () {
        for (let item in this.quotationItem.Items) {
            var exchangeRate = this.Currencies[this.quotationItem.Items[item].Price.Currency]
            var price =  parseFloat(this.quotationItem.Items[item].Price.Amount).toFixed(2)
            var markup = parseFloat(this.MarkUp/100).toFixed(2)
            this.quotationItem.Items[item]['UnitPrice'] = parseFloat(parseFloat(parseFloat(parseFloat(price) + parseFloat(price * markup))/exchangeRate) + parseFloat(parseFloat(parseFloat(parseFloat(price) + parseFloat(price * markup))/exchangeRate) * .12)).toFixed(2)
            this.quotationItem.Items[item]['TotalAmount'] =  parseFloat(parseFloat(this.quotationItem.Items[item]['UnitPrice'])  * this.quotationItem.Items[item].Quantity).toFixed(2)
            this.totalQuote = parseFloat(parseFloat(this.totalQuote) + parseFloat(this.quotationItem.Items[item]['TotalAmount'])).toFixed(2)
          }
        this.totalQuote = 0
        for (let item in this.quotationItem.Items) {
            this.totalQuote = parseFloat(parseFloat(this.totalQuote) + parseFloat(this.quotationItem.Items[item]['TotalAmount'])).toFixed(2)
        }
    },
    sendNotification (quotationItem) {
     
        var customerName = quotationItem.Customer.Name
        var companyName = quotationItem.Customer.Others.CompanyName
        var recipientId = quotationItem.Customer.ContactId
        quotationItem['CustomerName'] = customerName
        quotationItem['CustomerCompany'] = companyName
        
        for (let item in quotationItem.Items) {
            var supplierName = quotationItem.Items[item].OtherInformation.SupplierName
            var supplierAddress = quotationItem.Items[item].OtherInformation.SupplierAddress
            quotationItem.Items[item]['SupplierName'] = supplierName
            quotationItem.Items[item]['SupplierAddress'] = supplierAddress
            quotationItem.Items[item]['Images'] = quotationItem.Items[item].Images[0]
        }
        
        var purchaselink = 'http://blaise-scientific-trading.herokuapp.com/purchase/' + quotationItem._id
        var declinelink = 'http://blaise-scientific-trading.herokuapp.com/decline/' + quotationItem._id
        
        quotationItem['PurchaseLink'] = purchaselink;
        quotationItem['DeclineLink'] = declinelink;
        console.log(quotationItem)
        axios({
            method: 'post',
            url: 'http://2726d92e.ngrok.io/api/v1/notify/sendSimple',
            data: {
                Payload: quotationItem,
                RecipientId: recipientId,
                NotificationTemplateId: '5a71129c64e4887f94096868'
            },
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
            }
        })
        .then (response => {
            this.Errors = 'Successfully sent quotation to Client'
            this.snackbar.action = 'check'
            this.snackbar.color = 'green'
            this.Snackbar = !this.Snackbar
        })
        .catch (err => {
            this.Errors = 'Failed to send quotation to Client'
            this.snackbar.action = 'clear'
            this.snackbar.color = 'red'
            this.Snackbar = !this.Snackbar
        })
    }
  }
}
</script>

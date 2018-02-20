<template>
<v-container>
  <v-card>
    <v-toolbar dark color="primary"><v-toolbar-title>Quotations</v-toolbar-title></v-toolbar>
    <v-card-text>
      <v-data-table
      v-bind:headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{props.item.UpdatedBy}}</td>
      <td>{{props.item.DateCreated}}</td>
      <td>{{props.item.DateUpdated}}</td>
      <td><v-btn icon flat @click="viewQuotation(props.item._id)"><v-icon>visibility</v-icon></v-btn></td>
    </template>
  </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="viewQuotationDialog" max-width="1200px">
<v-toolbar dark color="primary">
  <v-toolbar-title>Quotation Information</v-toolbar-title>
</v-toolbar>
    <v-card>
      <v-card-text>
          <v-layout row wrap>
              <v-flex xs2>
                  <h3>Customer Name:</h3>
              </v-flex>
              <v-flex xs4>
                  <p>{{quotationItem.CreatedBy}}</p>
              </v-flex>
              <v-flex xs2>
                  <h3>Company Name:</h3>
              </v-flex>
              <v-flex xs4>
                  <p>{{otherInformation.CompanyName}}</p>
              </v-flex>
              <v-flex xs2>
                  <h3>Quoted By:</h3>
              </v-flex>
              <v-flex xs4>
                  <p>{{quotationItem.UpdatedBy}}</p>
              </v-flex>
              <v-flex xs2>
                  <h3>Expiration Date:</h3>
              </v-flex>
              <v-flex xs4>
                  <p>{{quotationItem.ExpirationDate}}</p>
              </v-flex>
              <v-flex xs10 offset-xs1>
                  <v-layout row wrap>
                      <v-flex xs3>
                          <h4>Product Name</h4>
                      </v-flex>
                      <v-flex xs3>
                          <h4>Quantity</h4>
                      </v-flex>
                      <v-flex xs3>
                          <h4>Unit Price (PHP)</h4>
                      </v-flex>
                      <v-flex xs3>
                          <h4>Price (PHP)</h4>
                      </v-flex>
                  </v-layout>
              </v-flex>
              <v-flex xs10 offset-xs1>
                <v-layout row wrap>
                    <template v-for="item in quotationItem.Items">
                        <v-flex xs3>
                            <i>{{item.Name}}</i>
                        </v-flex>
                        <v-flex xs3>
                            <i>{{item.Quantity}}</i>
                        </v-flex>
                        <v-flex xs3>
                            <i>{{item.UnitPrice}}</i>
                        </v-flex>
                        <v-flex xs3>
                            <i>{{item.TotalAmount}}</i>
                        </v-flex>
                    </template>
                </v-layout>
              </v-flex>
              <v-flex xs3 offset-xs6>
                  <h3>Total Amount:</h3>
              </v-flex>
              <v-flex xs3>
                  {{quotationItem.TotalQuote}}
              </v-flex>
          </v-layout>
      </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="viewQuotationDialog=!viewQuotationDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>




<script>
import axios from 'axios'

export default{
  data () {
    return {
      viewQuotationDialog: false,
      quotationId: '',
      quotationItem: {},
      headers: [
        {
          text: 'Quoted By',
          value: 'UpdatedBy',
          align: 'center'
        },
        {
          text: 'Date Submitted',
          value: 'DateCreated',
          align: 'center'
        },
        {
          text: 'Date Quoted',
          value: 'DateUpdated',
          align: 'center'
        },
        {
          sortable: false
        }
      ],
      items: [],
      otherInformation: {}
    }
  },
  computed: {
    User () {
        return this.$store.getters.getUser
    }  
  },
  mounted () {
    this.getQuotation()
  },
  methods: {
    getQuotation () {
      axios({
        method: 'get',
        url: 'http://8f466630.ngrok.io/api/v1/quotation/quote/' + localStorage.getItem('UserId'),
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.items = response.data.items
        })
    },
    getQuotationDetail () {
      axios({
        method: 'get',
        url: 'http://8f466630.ngrok.io/api/v1/quotation/' + this.quotationId,
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response=>{
          this.quotationItem = response.data.model
          var expiryDate = new Date(this.quotationItem.DateUpdated)
          expiryDate = expiryDate.setDate(expiryDate.getDate() + 10)
          this.quotationItem['ExpirationDate'] = new Date(expiryDate)
          this.otherInformation = response.data.model.Customer.Others
          console.log(this.quotationItem)
        })
    },
    viewQuotation (value) {
      this.quotationId = value
      this.viewQuotationDialog = !this.viewQuotationDialog
      this.getQuotationDetail()
    }
  }
}
</script>

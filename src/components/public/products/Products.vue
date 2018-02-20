<template>
  <v-container grid-list-md text-xs-center>
  <v-card style="padding-top:20px; padding-bottom:20px">
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
        <v-text-field label="Search" hint="Product Name" v-model="ProductName" append-icon="search" @keyup="search" />
      </v-flex>
      <v-flex xs6>
        <v-select v-bind:items="categories" item-value="Name" item-text="Name" label="Category" hint="Product Category" v-model="Category" append-icon="filter_list" @input="search" />
      </v-flex>
      <v-flex xs12>
        <v-select v-bind:items="brandList" label="Brand" v-model="Brand" @input="searchMoreFilter"></v-select>
      </v-flex>
      <v-flex xs6>
        <v-select v-bind:items="specification" v-model="SpecificationFilter" label="Specification" @input="searchWithSpecification"></v-select>
      </v-flex>
      <v-flex xs6>
         <v-select label="Specification Value" v-bind:items="specificationvalues" v-model="SpecificationValueFilter" @input="searchMoreFilter"></v-select>
      </v-flex>
      </v-layout>
      </v-flex>
    </v-layout>
    <v-container grid-list-md>
    <v-layout row wrap style="padding-left:10px;padding-right:10px">
      <template v-if="Products.length > 0">
      <v-flex xs3 offset-xs0 v-for="product in Products" v-if="!Loading">
        <v-card>
          <v-card-media :src="product.Images[0]" height="200px">
          </v-card-media>
          <v-card-title>
            <h2>{{product.Name}}</h2>
            </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon color="success" @click="openAddDialog(product._id)"><v-icon>add_shopping_cart</v-icon></v-btn><v-btn icon color="warning" @click="openViewDialog(product._id)"><v-icon>visibility</v-icon></v-btn>
      </v-card-actions>
        </v-card>
      </v-flex>
    </template>
    <template v-if="Products.length <= 0">
      <v-card-text>
        <h3><i>No items to display</i></h3>
      </v-card-text>
    </template>
      <v-flex xs10 offset-xs1>
      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple" v-if="Loading"></v-progress-circular>
    </v-flex>
    </v-layout>
  </v-container>
  </v-card>
                 <v-dialog v-model="viewItemDailog" max-width="800px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Product Information</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                     <v-card-text>
                      <ProductView :id="viewItemId"/>
                     </v-card-text>
                   <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" @click="viewItemDailog=!viewItemDailog">Close</v-btn>
                     </v-card-actions>
                   </v-card>
                 </v-dialog>
                 <v-dialog v-model="addItemDialog" max-width="400px">
              <v-toolbar dark color="primary">
                 <v-toolbar-title>Quantity</v-toolbar-title>
              </v-toolbar>
                   <v-card>
                     <v-card-text>
                      <v-text-field type="number" label="Quantity" v-model="Quantity"/>
                     </v-card-text>
                   <v-card-actions>
                     <v-spacer></v-spacer>
                      <v-btn color="success" @click="addToShoppingCart">Add</v-btn>
                     <v-btn color="primary" @click="addItemDialog=!addItemDialog">Close</v-btn>
                     </v-card-actions>
                   </v-card>
                 </v-dialog>
            <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}}<v-spacer></v-spacer><v-icon>{{snackbar.actions}}</v-icon></v-snackbar>
</v-container>
</template>

<script>
import axios from 'axios'
import ProductView from '../../ProductsManagement/Forms/ProductView'

export default {
  data () {
    return {
      SpecificationValueFilter: '',
      specificationvalues: [],
      SpecificationFilter: '',
      specification: [],
      viewItemDailog: false,
      viewItemId: '',
      addItemId: '',
      Quantity: '',
      addItemDialog: false,
      categories: [],
      Products: [],
      ProductName: '',
      Category: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        actions: '',
        color: ''
      },
      Loading: false,
      Errors: '',
      viewItemId: '',
      viewItemDailog: false,
      brandList: [],
      Brand: ''
    }
  },
  mounted () {
    this.Loading = true
    axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 20,
        Filters: 'Name:/' + this.ProductName + '/,' + 'Category:/' + this.Category + '/',
        Context: localStorage.getItem('Context')
      }
    }).
    then(response => {
      this.Products = response.data.items
      for (let item in response.data.items) {
        var data = this.Products[item]
        for (let specItem in response.data.items[item].Specification) {
          if (this.specification.indexOf(specItem) < 0) {
            this.specification.push(specItem)
          }

          if (this.brandList.indexOf(data.OtherInformation.SupplierName) < 0) {
            this.brandList.push(data.OtherInformation.SupplierName)
          }
        }
      }
         this.Loading = false
    })
    .catch(err => {
      this.Products = err.response.data.items
      this.Loading = false
    })
    this.refreshAll()
  },
  methods: {
    searchMoreFilter () {
      axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 20,
        Filters: 'Name:/' + this.ProductName + '/,' + 'Category:/' + this.Category + '/,Specification.' + this.SpecificationFilter + ':/' + this.SpecificationValueFilter + '/,OtherInformation.SupplierName:/' + this.Brand + '/',
        Context: localStorage.getItem('Context')
      }
    }).
       then(response => {
         this.Products = response.data.items
         for (let item in response.data.items) {
            for (let specItem in response.data.items[item].Specification) {
              if (this.specification.indexOf(specItem) < 0) {
                this.specification.push(specItem)
              }
            }
         }
         this.Loading = false
       })
       .catch(err => {
         console.log(err.response.data)
         this.Products = err.response.data.items
         this.Loading = false
       })

    },
    searchWithSpecification () {
      this.specificationvalues = []
      for (let item in this.Products) {
        var data = this.Products[item].Specification[this.SpecificationFilter]
        if (this.specificationvalues.indexOf(data) < 0) {
          this.specificationvalues.push(this.Products[item].Specification[this.SpecificationFilter])
        }
      }
    },
    getProduct () {
     this.specificationvalues = []
     this.specification = []
     axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 20,
        Filters: 'Name:/' + this.ProductName + '/,' + 'Category:/' + this.Category + '/',
        Context: localStorage.getItem('Context')
      }
    }).
       then(response => {
         this.Products = response.data.items
         for (let item in response.data.items) {
            for (let specItem in response.data.items[item].Specification) {
              if (this.specification.indexOf(specItem) < 0) {
                this.specification.push(specItem)
              }
            }
         }
         this.Loading = false
       })
       .catch(err => {
         console.log(err.response.data)
         this.Products = err.response.data.items
         this.Loading = false
       })
    },
    search () {
      this.getProduct()
    },
    openAddDialog (value) {
      this.addItemDialog = !this.addItemDialog
      this.addItemId = value
    },
    addToShoppingCart () {
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/' + this.addItemId,
        params: {
          Context: localStorage.getItem('Context')
        }
      })
        .then(response =>{
          var itemModel = response.data.model
          itemModel['Quantity'] = this.Quantity
          this.Quantity = ''
          this.$store.dispatch('addItemToCart',itemModel)
          this.addItemDialog = !this.addItemDialog
          this.snackbar.color = 'green'
          this.Errors = 'Successfully added to cart'
          this.snackbar.actions = 'check'
          this.Snackbar = true
        })
    },
    openViewDialog (value) {
      this.viewItemDailog = true
      this.viewItemId = value
    },
    refreshAll () {
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/category',
        params: {
          Context: localStorage.getItem('Context')
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.categories = response.data.items
          console.log(this.categories)
        })
        .catch(err => {

        })
    }
  },
  components: {
    ProductView
  }
}
</script>

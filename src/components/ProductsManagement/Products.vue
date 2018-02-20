<template>
        <v-container>
            <v-layout row wrap justify-space-between>
                <v-flex xs12>
                    <v-card :class="hideCategory? 'hidden-sm-and-up':''">
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>Category Management</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <v-btn slot="activator" icon flat @click="hideCategory=!hideCategory"><v-icon>close</v-icon></v-btn>
                                <span>Close this window</span>
                            </v-tooltip>
                        </v-toolbar>
                        <v-card-text>
                          <v-data-table v-bind:headers="categoryHeaders" :items="categories" hide-actions class="elevation-1">
                            <template slot="items" slot-scope="props">
                              <td>{{props.item.Name}}</td>
                              <td>{{props.item.CreatedBy}}</td>
                              <td><v-btn flat color="red" @click="deleteCategory(props.item._id)"><v-icon>delete</v-icon></v-btn></td>
                            </template>
                          </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card flat :class="hideCategory? 'hidden-sm-and-up':''">
                        <v-toolbar flat></v-toolbar>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card :class="hideFeature? 'hidden-sm-and-up':''">
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>Specification Management</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <v-btn slot="activator" icon flat @click="hideFeature=!hideFeature"><v-icon>close</v-icon></v-btn>
                                <span>Close this window</span>
                            </v-tooltip>
                        </v-toolbar>
                        <v-card-text>
                          <v-data-table v-bind:headers="specificationHeader" :items="specifications" hide-actions class="elevation-1">
                            <template slot="items" slot-scope="props">
                              <td>{{props.item.Category}}</td>
                              <td>{{props.item.SpecificationItem}}</td>
                              <td>{{props.item.CreatedBy}}</td>
                              <td>{{props.item.DateCreated}}</td>
                              <td><v-btn flat color="red" @click="deleteFeature(props.item._id)"><v-icon>delete</v-icon></v-btn></td>
                            </template>
                          </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card flat :class="hideFeature? 'hidden-sm-and-up':''">
                        <v-toolbar flat></v-toolbar>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card>
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>Product Listing</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <v-btn icon slot="activator" flat @click="hideCategory=!hideCategory"><v-icon>filter_list</v-icon></v-btn>
                                <span>Open Category Management</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <v-btn icon slot="activator" flat @click="hideFeature=!hideFeature"><v-icon>description</v-icon></v-btn>
                                <span>Open Feature Management</span>
                            </v-tooltip>
                        </v-toolbar>
                        <v-card-text>
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-text-field label="Search Product by Name" append-icon="search" v-model="ProductName" hint="Product Name" @keyup="search"></v-text-field>
                                    </v-flex>
                                    <v-flex xs5 offset-xs1>
                                        <v-select label="Filter by Category" v-bind:items="categories" item-text="Name" item-value="Name" v-model="CategoryFilter" @change="search"></v-select>
                                    </v-flex>
                                    <v-flex xs2 offset-xs5>
                                        <h3>Product List</h3>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-container fluid>
                                            <template v-if="Products.length<=0">
                                                <v-layout row wrap>
                                                    <v-flex xs4 offset-xs4>
                                                        <span><i>No items to display</i></span>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <template v-if="Loading">
                                                <v-layout row wrap>
                                                    <v-flex xs4 offset-xs4>
                                                        <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="purple"></v-progress-circular>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <template v-if="Products.length>0">
                                                <v-layout row justify-space-around>
                                                    <!--Product Grid List-->
                                                    <v-flex xs3 v-for="product in Products">
                                                        <v-card hover>
                                                            <v-card-media :src="product.Images[0]" height="150"></v-card-media>
                                                            <v-card-title>
                                                              <h2>{{product.Name}}</h2>
                                                            </v-card-title>
                                                            <v-card-actions>
                                                              <v-spacer></v-spacer>
                                                              <v-tooltip top>
                                                                <v-btn icon flat slot="activator" color="success" @click="viewProduct(product._id)"><v-icon>visibility</v-icon></v-btn>
                                                                <span>view product</span>
                                                              </v-tooltip>
                                                              <v-tooltip top>
                                                                <v-btn flat icon slot="activator" color="yellow" @click="editProduct(product._id)"><v-icon>mode_edit</v-icon></v-btn>
                                                                <span>edit product</span>
                                                              </v-tooltip>
                                                              <v-tooltip top>
                                                                <v-btn flat icon slot="activator" color="red" @click="deleteProduct(product._id)"><v-icon>delete</v-icon></v-btn>
                                                                <span>delete product</span>
                                                              </v-tooltip>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-flex>
                                                    <!--End of Product Grid List-->
                                                </v-layout>
                                                <v-layout row justify-space-around>
                                                    <v-flex xs8>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                        </v-container>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs1 offset-xs11>
                     <v-speed-dial v-model="fab" top right hover transition="slide-y-reverse-transition">
                        <v-btn slot="activator" color="red" dark fab hover v-model="fab"><v-icon>add</v-icon><v-icon>close</v-icon></v-btn>
                        <v-tooltip left>
                            <v-btn slot="activator" fab small dark color="success" @click.native.stop="addProductDialog=!addProductDialog"><v-icon>list</v-icon></v-btn>
                            <span>Add Product</span>
                        </v-tooltip>
                        <v-tooltip left>
                            <v-btn slot="activator" fab small dark color="indigo" @click.native.stop="addCategoryDialog=!addCategoryDialog"><v-icon>filter_list</v-icon></v-btn>
                            <span>Add Category</span>
                        </v-tooltip>
                        <v-tooltip left>
                            <v-btn fab slot="activator" small dark color="black" @click.native.stop="addFeatureDialog=!addFeatureDialog"><v-icon>description</v-icon></v-btn>
                            <span>Add Specification</span>
                        </v-tooltip>
                    </v-speed-dial>
                </v-flex>
            </v-layout>
        <!--Category Dialog-->
            <v-dialog v-model="addCategoryDialog" max-width="500">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Add Category</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs10 offset-xs1>
                                 <v-text-field label="Category Name" v-model="CategoryName"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green" flat @click="SubmitCategory">Submit</v-btn>
                        <v-btn color="red" @click="addCategoryDialog=!addCategoryDialog" flat>Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        <!--End of Category Dialog-->
        <!--Add Feature Dialog-->
            <v-dialog v-model="addFeatureDialog" max-width="600">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Add Specification</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs10 offset-xs1>
                                 <v-select v-bind:items="categories" item-text="Name" item-value="Name" label="Product Category" v-model="FeatureCategory"></v-select>
                            </v-flex>
                            <template v-for="(index,item) in SpecificationItem">
                                <v-flex xs8 offset-xs1>
                                    <v-text-field label="Specification Item" v-model="SpecificationItem[item]"></v-text-field>
                                </v-flex>
                                <v-flex xs1 offset-xs1>
                                    <v-tooltip top>
                                        <v-btn slot="activator" icon flat @click="deleteSpecificationItem(index)"><v-icon>close</v-icon></v-btn>
                                        <span>Delete Specification Item</span>
                                    </v-tooltip>
                                </v-flex>
                            </template>
                            <v-flex xs2>
                                <v-btn color="primary" flat @click="addSpecificationItemSlot">Add item</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="green" @click="submitFeature">Submit</v-btn>
                        <v-btn flat color="red" @click="addFeatureDialog=!addFeatureDialog">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        <!--End of Feature Dialog-->
        <!--View Product Dialog-->
            <v-dialog v-model="viewProductDialog" max-width="800">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Product Information</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <ProductView :id="viewItemId"/>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="viewProductDialog=!viewProductDialog">close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        <!--End of Product View Dialog-->
        <!-- Delete dialog -->
          <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Delete Item</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <h3>Do you want to delete this item?</h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" flat @click="deleteitem">Delete</v-btn>
                <v-btn color="primary" flat @click="deleteDialog=!deleteDialog">close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        <!-- end of delete dialog -->
        <!-- Add Product -->
           <v-dialog v-model="addProductDialog" max-width="700">
               <ProductForm @close="closeAddProductDialog" :id="editItemId"/>
           </v-dialog>
        <!-- End of Add Product -->
            <v-snackbar :color="snackbar.color" :timeout="snackbar.timeout" :vertical="snackbar.vertical" :multi="snackbar.multi" top v-model="Snackbar" >{{Errors}}<v-btn flat dark @click.native="Snackbar = false"><v-icon>{{snackbar.actions}}</v-icon></v-btn>
            </v-snackbar>
        </v-container>
</template>

<script>
import axios from 'axios';
import ProductForm from './Forms/ProductForm'
import ProductView from './Forms/ProductView'
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    CategoryName: {
      required,
      minLength: minLength(3)
    }
  },
  name: 'Products',
  data () {
    return {
      CategoryFilter: '',
      addProductDialog: false,
      FeatureCategory: '',
      categoryHeaders: [
        {
          text: 'Name',
          align: 'center',
          value: 'Name'
        },
        {
          text: 'Created By',
          align: 'center',
          value: 'CreatedBy'
        },
        {
          text: ''
        }
      ],
      specificationHeader: [
        {
          text: 'Category Name',
          align: 'center',
          value: 'Category'
        },
        {
          text: 'Specifications',
          align: 'center',
          value: 'SpecificationItem'
        },
        {
          text: 'Created By',
          align: 'center',
          value: 'CreatedBy'
        },
        {
          text: 'Date Created',
          align: 'center',
          value: 'DateCreated'
        },
        {
          text: ''
        }
      ],
      specifications: [],
      SpecificationItem: [],
      deleteMode: 0,
      categories: [],
      addFeatureDialog: false,
      addCategoryDialog: false,
      hideFeature: true,
      hideCategory: true,
      fab: false,
      right: true,
      bottom: true,
      viewProductDialog: false,
      viewItemId: '',
      editItemId: '',
      deleteItemId: '',
      deleteDialog: false,
      clearData: true,
      ValidProduct: true,
      ProductName: '',
      Products: [],
      Skip: 0,
      Loading: false,
      dialog2: false,
      categoryDialog: false,
      CategoryName: '',
      Snackbar: false,
      snackbar :{
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        color: 'red',
        actions: ''
      },
      Errors: '',
      Data: {}
    }
  },
  mounted () {
    this.Loading = true
    axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
      params:{
        skip: this.Skip,
        limit: 10,
        Filters: 'Name:/' + this.ProductName + '/',
        Context: localStorage.getItem('Context')
      }
    }).
       then(response => {
         this.Products = response.data.items
         this.Loading = false
       })
       .catch(err => {
         this.Products = err.response.data.items
         this.Loading = false
       })

    this.refreshAllItems()
  },
  methods: {
    deleteProduct (value) {
      this.deleteItemId = value
      this.deleteMode = 3
      this.deleteDialog = !this.deleteDialog
    },
    editProduct (value) {
      this.editItemId = value
      this.addProductDialog = !this.addProductDialog
    },
    viewProduct (value) {
      this.viewItemId = value
      this.viewProductDialog = !this.viewProductDialog
    },
    closeAddProductDialog () {
      this.addProductDialog = !this.addProductDialog
      this.refreshAllItems()
    },
    deleteFeature (value) {
      this.deleteMode = 2
      this.deleteItemId = value
      this.deleteDialog = !this.deleteDialog
    },
    submitFeature () {
      let valueData = {
        Category: this.FeatureCategory,
        SpecificationItem: this.SpecificationItem
      }
      axios({
        method: 'post',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/specification',
        data: valueData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.Errors = response.data.message
          this.snackbar.color = 'success'
          this.snackbar.actions = 'check'
          this.Snackbar = !this.Snackbar
          this.addFeatureDialog = !this.addFeatureDialog
          this.FeatureCategory = ''
          this.SpecificationItem = []
          this.refreshAllItems()
        })
        .catch(err => {
          this.Errors = err.response.data.message
          this.snackbar.color = 'red'
          this.snackbar.actions = 'close'
          this.Snackbar = !this.Snackbar
        })
    },
    deleteCategory (id) {
      this.deleteMode = 1;
      this.deleteItemId = id;
      this.deleteDialog = !this.deleteDialog;
    },
    search () {
      this.Loading = true
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
        params:{
          skip: this.Skip,
          limit: 10,
          Filters: 'Name:/' + this.ProductName + '/,Category:/' + this.CategoryFilter + '/',
          Context: localStorage.getItem('Context')
        }
      }).
         then(response => {
           this.Products = response.data.items
           this.Loading = false
         })
         .catch(err => {
           console.log(err.response.data)
           this.Products = err.response.data.items
           this.Loading = false
         })
    },
    addCategory () {
      this.categoryDialog = !this.categoryDialog
    },
    SubmitCategory () {
      axios({
        method: 'post',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/category',
        data: {Name: this.CategoryName},
        headers: {
            'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
      })
        .then(response => {
          this.categoryDialog = false
          this.Errors = response.data.message
          this.snackbar.color = 'success'
          this.snackbar.actions = 'check'
          this.Snackbar = true,
          this.CategoryName = ''
          this.addCategoryDialog = !this.addCategoryDialog
          this.refreshAllItems()
        })
        .catch(err => {
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
        })

    },
    ifValidProductInfo (value) {
      if (value) {
        this.ValidProduct = false
      }
      else {
        this.ValidProduct = true
      }
    },
    emittedData (value) {
      this.Data = value
    },
    Submit () {
      console.log(this.Data)
      if (this.Data._id != null || this.Data._id != undefined) {
         axios({
        method: 'put',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
        data: this.Data,
        headers: {
          'Authorization' : 'Bearer ' + this.$store.getters.getAuthCode
        }
      })
        .then(response =>{
          this.dialog2 = false
          this.clearData = !this.clearData
          this.Errors = response.data.message,
          this.snackbar.color = 'success',
          this.snackbar.actions = 'check',
          this.Snackbar = true
          this.refresh()
        })
        .catch(err =>{
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
          this.refresh()
        })
      }
      else {
        axios({
        method: 'post',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
        data: this.Data,
        headers: {
          'Authorization' : 'Bearer ' + this.$store.getters.getAuthCode
        }
      })
        .then(response =>{
          this.dialog2 = false
          this.clearData = !this.clearData
          this.Errors = response.data.message,
          this.snackbar.color = 'success',
          this.snackbar.actions = 'check',
          this.Snackbar = true
          axios({
            method: 'get',
            url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
            params:{
              skip: this.Skip,
              limit: 20,
              Filters: 'Name:/' + this.ProductName + '/',
              Context: localStorage.getItem('Context')
            }
          }).
             then(response => {
               for (let i in response.data.items){
                 response.data.items[i].Description = response.data.items[i].Description.replace(/\n/g, "<br />")
           if (response.data.items[i].Description.length >150) {
            response.data.items[i].Description = response.data.items[i].Description.substring(0, 147) + '...'
           }
           response.data.items[i].Features = response.data.items[i].Features.replace(/\n/g, "<br />")
           if (response.data.items[i].Features.length >150) {
            response.data.items[i].Features = response.data.items[i].Features.substring(0, 147) + '...'
               }
             }
               this.Products = response.data.items
               this.Loading = false
             })
             .catch(err => {
               console.log(err.response.data)
               this.Products = err.response.data.items
               this.Loading = false
             })
        })
        .catch(err =>{
          this.Errors = err.response.data.message,
          this.snackbar.color = 'error',
          this.snackbar.actions = 'close',
          this.Snackbar = true
          axios({
            method: 'get',
            url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
            params:{
              skip: this.Skip,
              limit: 20,
              Filters: 'Name:/' + this.ProductName + '/',
              Context: localStorage.getItem('Context')
            }
          }).
             then(response => {
               this.Products = response.data.items
               this.Loading = false
             })
             .catch(err => {
               console.log(err.response.data)
               this.Products = err.response.data.items
               this.Loading = false
             })
        })
      }
    },
    openDeleteDialog (value) {
      this.deleteItemDialog = true
      this.deleteItemId = value
    },
    deleteitem () {
      if (this.deleteMode === 1) {
        axios({
        method: 'delete',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/category/' + this.deleteItemId,
        headers: {
          'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
      }).
         then(response => {
           this.deleteItemId = ''
           this.Errors = response.data.message
           this.snackbar.color = 'success'
           this.snackbar.actions = 'check'
           this.Snackbar = true
           this.deleteItem = ''
           this.deleteMode = 0
           this.deleteDialog = false
           this.refreshAllItems()
         })
         .catch(err => {
           this.Errors = err.response.data.message
           this.snackbar.color = 'error'
           this.snackbar.actions = 'close'
           this.Snackbar = true
           this.deleteItemDialog = false
         })
      }
      else if (this.deleteMode === 2) {
        console.log('hey')
        axios({
        method: 'delete',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/specification/' + this.deleteItemId,
        headers: {
          'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
      }).
         then(response => {
           this.deleteItemId = ''
           this.Errors = response.data.message
           this.snackbar.color = 'success'
           this.snackbar.actions = 'check'
           this.Snackbar = true
           this.deleteDialog = !this.deleteDialog
           this.deleteItemId = ''
           this.deleteMode = 0
           this.refreshAllItems()
         })
         .catch(err => {
           this.Errors = err.response.data.message
           this.snackbar.color = 'error'
           this.snackbar.actions = 'close'
           this.Snackbar = true
           this.deleteItemDialog = false
         })
      }
      else {
        axios({
        method: 'delete',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/' + this.deleteItemId,
        headers: {
          'Authorization' : 'Bearer '+ this.$store.getters.getAuthCode
        }
        }).
         then(response => {
           this.deleteItemId = ''
           this.Errors = response.data.message
           this.snackbar.color = 'success'
           this.snackbar.actions = 'check'
           this.Snackbar = true
           this.deleteDialog = false
           this.deleteItem = ''
           this.deleteMode = 0
           this.refreshAllItems()
         })
         .catch(err => {
           this.Errors = err.response.data.message
           this.snackbar.color = 'error'
           this.snackbar.actions = 'close'
           this.Snackbar = true
           this.deleteItemDialog = false
         })
      }

    },
    refresh () {
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
        params:{
          skip: this.Skip,
          limit: 20,
          Filters: 'Name:/' + this.ProductName + '/',
          Context: localStorage.getItem('Context')
        }
      }).
         then(response => {
           for (let i in response.data.items){
             response.data.items[i].Description = response.data.items[i].Description.replace(/\n/g, "<br />")
           if (response.data.items[i].Description.length >150) {
            response.data.items[i].Description = response.data.items[i].Description.substring(0, 147) + '...'
           }
           response.data.items[i].Features = response.data.items[i].Features.replace(/\n/g, "<br />")
           if (response.data.items[i].Features.length >150) {
            response.data.items[i].Features = response.data.items[i].Features.substring(0, 147) + '...'
           }
         }
           this.Products = response.data.items
           this.Loading = false
         })
         .catch(err => {
           this.Products = err.response.data.items
           this.Loading = false
         })
    },
    openViewDialog (value) {
      this.viewItemId = value
      this.viewItemDailog = !this.viewItemDailog
    },
    openEditDialog (value) {
      this.editItemId = value
      this.dialog2 = !this.dialog2
    },
    addSpecificationItemSlot () {
        this.SpecificationItem.push('')
    },
    deleteSpecificationItem (value) {
        this.SpecificationItem.splice(value,1)
    },
    refreshAllItems () {
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/category',
        params: {
          Context: localStorage.getItem('Context')
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Context')
        }
      })
        .then(response => {
          this.categories = response.data.items
        })
        .catch(err => {

        })
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/specification',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          this.specifications = response.data.items

        })
        .catch(err => {

        })
        axios({
          method: 'get',
          url: 'http://5ab1b8cd.ngrok.io/api/v1/products/',
          params:{
            skip: this.Skip,
            limit: 20,
            Filters: 'Name:/' + this.ProductName + '/',
            Context: localStorage.getItem('Context')
          }
        }).
         then(response => {
           this.Products = response.data.items
           this.Loading = false
         })
         .catch(err => {
           this.Products = err.response.data.items
           this.Loading = false
         })

    }
  },
  computed: {
    categoryErrors () {
      const errors = []
      if (!this.$v.CategoryName.$dirty) return errors
      !this.$v.CategoryName.required && errors.push('Category is required')
      !this.$v.CategoryName.minLength && errors.push('Minimum length of 3')
      return errors
    }
  },
  components: {
    ProductForm,
    ProductView
  }
}
</script>

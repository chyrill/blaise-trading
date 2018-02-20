<template>
<v-card>
  <v-toolbar color="primary" dark>
    <v-toolbar-title>Product Information</v-toolbar-title>
  </v-toolbar>
  <v-container grid-list-md>
    <v-form>
      <v-layout row wrap>
        <v-flex xs3 v-for="(pics, index ) in Images">
          <img :src="pics" style="width:100px;height:100px" />
          <v-btn icon @click="deleteImage(index)"><v-icon>close</v-icon></v-btn>
        </v-flex>
        <input type="file" id="picUpload" name="picture" hidden @change="uploadImage" />
        <v-flex xs10 offset-xs1>
          <v-btn dark color="accent" @click="tickUpload">Upload Image
            <v-icon right>add_a_photo</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Product Name" required v-model="Name" :error-messages="nameErrors" @blur="$v.Name.$touch()" @input="$v.Name.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field label="SKU" required v-model="SKU" :error-messages="skuErrors" @blur="$v.SKU.$touch()" @input="$v.SKU.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field multi-line label="Description" required v-model="Description" :error-messages="descriptionErrors" @blur="$v.Description.$touch()" @input="$v.Description.$touch()" />
      </v-flex>
        <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
            <v-select label="Category" v-bind:items="categories" item-text="Name" item-value="Name" required :error-messages="categoryErrors" @blur="$v.Category.$touch()" @input="$v.Category.$touch()" v-model="Category"> </v-select>
          </v-flex>
          <v-flex xs6>
            <v-select label="Product Type" v-bind:items="productTypes" v-model="ProductType" required :error-messages="productTypesErrors" @blur="$v.ProductType.$touch()" @input="$v.ProductType.$touch()"> </v-select>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
        <h2>Specification</h2>
      </v-flex>
      <template v-for="value in SpecificationItem">
        <v-flex xs4 offset-xs1>
          <v-text-field :label="value" v-model="Specification[value]"  required/>
        </v-flex>
      </template>
       <v-flex xs12>
        <v-divider></v-divider>
        <h2>Product Price</h2>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs4>
            <v-select label="Currency" v-bind:items="currencies" v-model="Currency"> </v-select>
          </v-flex>
          <v-flex xs8>
            <v-text-field label="Amount" type="number" v-model="Amount" required :error-messages="amountErrors" @blur="$v.Amount.$touch()" @input="$v.Amount.$touch()"/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout row wrap v-if="ProductType === 'Imported Goods'">
      <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12>
      <span style="color:#0091EA"><h2>Supplier Information</h2></span>
    </v-flex>
      <v-flex xs10 offset-xs1>
        <!-- <v-text-field label="Supplier Name"  required v-model="SupplierName" :error-messages="supplierNameErrors" @blur="$v.SupplierName.$touch()" @input="$v.SupplierName.$touch()"/> -->
        <v-select v-bind:items="BrandInformations" v-model="SupplierName" label="Supplier Name" :error-messages="supplierNameErrors" autocomplete item-text="SupplierName" item-value="SupplierName" cache-items tags @input="setOtherInfomtaion"></v-select>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field multi-line label="Address" v-model="SupplierAddress" :error-messages="supplierAddressErrors" @blur="$v.SupplierAddress.$touch()" @input="$v.SupplierAddress.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field label="Contact Number" mask="(##)###-#####" v-model="SupplierContactNumber" />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Email Address" required v-model="SupplierEmail" :error-messages="supplierEmailErrors" @input="$v.SupplierEmail.$touch()" @blur="$v.SupplierEmail.$touch()" />
          </v-flex>
        </v-layout>
      </v-flex>
      </v-layout>
      </v-layout>
    </v-form>
    <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} <v-spacer></v-spacer><v-icon>{{snackbar.actions}}</v-icon></v-snackbar>
  </v-container>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat color="primary" @click="submit" :disabled="$v.$invalid">Submit</v-btn>
    <v-btn flat color="red" @click.stop="closeform">Close</v-btn>
  </v-card-actions>
</v-card>
</template>



<script>
import axios from 'axios'
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    Name: {
      required,
      minLength: minLength(3)
    },
    Description: {
      required,
      minLength: minLength(6)
    },
    SKU: {
      required
    },
    ProductType: {
      required
    },
    Amount: {
      required
    },
    SupplierName: {
      required
    },
    SupplierAddress: {
      required
    },
    Category: {
      required
    },
    SupplierEmail: {
      required,
      email
    }
  },
  props: ['id','refresh'],
  name: 'ProductForm',
  data () {
    return {
      clearData: false,
      _id: '',
      currencies: [],
      productTypes: ['Imported Goods'],
      categories: [],
      Name: '',
      Description: '',
      Features: '',
      SKU: '',
      SupplierName: '',
      SupplierAddress: '',
      SupplierContactNumber: '',
      SupplierEmail: '',
      ProductType: '',
      Category: '',
      Amount: '',
      Currency: '',
      Snackbar: false,
      snackbar :{
        timeout: 6000,
        top: true,
        multi: false,
        vertical: true,
        color: '',
        actions: ''
      },
      Errors: '',
      Images: [],
      IsValid: false,
      Data: {
        Name: '',
        Images: '',
        Description: '',
        Specification: {},
        Category: '',
        ProductType: '',
        SKU: '',
        Price: {},
        OtherInformation: {}
      },
      OtherInformation: {
        SupplierName: '',
        SupplierAddress: '',
        SupplierContactNumber: '',
        SupplierEmail: ''
      },
      Price: {
        Currency: '',
        Amount: ''
      },
      Specification: {

      },
      SpecificationItem: [],
      BrandInformations: []
    }
  },
  mounted () {
    this.refreshAll()
    this.setBrandInformationListing()
  },
  methods: {
    tickUpload () {
      if (this.Images.length >= 4) {
        this.Snackbar = true
        this.Errors = 'You can only add 4 Product Images'
      }
      else {
          document.getElementById('picUpload').click()
      }
    },
    uploadImage (e) {
      var data = e.target.files || e.dataTransfer.files
      var filename = data[0].name
      var split = filename.split('.')
      var extname = split[split.length - 1]
      var imageList = ['png', 'jpeg', 'jpg']
      var letmesee = imageList.indexOf(extname)
      if (letmesee < 0) {
        document.getElementById('picUpload').value = ''
        this.Snackbar = true
        this.Errors = 'You can only upload an image file'
      } else {
        const formData = new FormData()
        formData.set('uploaddata', data[0])
        axios.post('http://1510ec71.ngrok.io/api/v1/upload', formData)
          .then(response => {
            this.Images.push(response.data.model)
          })
          .catch(err => {

          })
      }
    },
    deleteImage (index) {
      this.Images.splice(index,1)
    },
    refreshAll () {
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
          console.log('puta')
          this.categories = response.data.items
          axios({
            method: 'get',
            url: 'https://api.fixer.io/latest'
          })
          .then(response =>{
            var rates = response.data.rates
            for (let i in rates) {
            this.currencies.push(i)
            }
          })
        })
        .catch(err => {

        })
    },
    submit () {

      if (this.Images.length <= 0) {
        this.Errors = 'Must have atleast 1 image'
        this.snackbar.color = 'red'
        this.snackbar.actions = 'close'
        this.Snackbar = !this.Snackbar
      }
      else {
        for (let item in this.Price) {
        this.Price[item] = this[item]
        }

        for (let item in this.OtherInformation) {
        this.OtherInformation[item] = this[item]
        }

        for (let item in this.Data){
          this.Data[item] = this[item]
        }
        if ( this._id === null || this._id === undefined) {
          axios({
            method: 'post',
            url: 'http://5ab1b8cd.ngrok.io/api/v1/products',
            data: this.Data,
            headers: {
            Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
            }
          })
            .then(response => {
              this.Errors = response.data.message
              this.snackbar.color = 'success'
              this.snackbar.actions = 'check'
              this.Snackbar = !this.Snackbar
              this.clearData = !this.clearData
              this.$emit('close')
            })
            .catch(err => {
              this.Errors = err.response.data.message
              this.snackbar.color = 'red'
              this.snackbar.actions = 'close'
              this.Snackbar = !this.Snackbar
            })
        }
        else {

          this.Data['_id'] = this._id
          axios({
            method: 'put',
            url: 'http://5ab1b8cd.ngrok.io/api/v1/products',
            data: this.Data,
            headers: {
            Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
            }
          })
            .then(response => {
              this.Errors = response.data.message
              this.snackbar.color = 'success'
              this.snackbar.actions = 'check'
              this.Snackbar = !this.Snackbar
              this.clearData = !this.clearData
              this.$emit('close')
            })
            .catch(err => {
              this.Errors = err.response.data.message
              this.snackbar.color = 'red'
              this.snackbar.actions = 'close'
              this.Snackbar = !this.Snackbar
            })
        }

      }
    },
    closeform () {
      this.$emit('close')
    },
    clearAllForm () {
      for (let item in this) {
        this[item] = ''
      }
    },
    setBrandInformationListing () {
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/products',
        params: {
           Context: localStorage.getItem('Context'),
           limit: 100
        },
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
      .then(response => {
        var products = response.data.items

        for (let i in products) {
          var product = products[i]

          var exist = this.BrandInformations.filter(data => {return data.SupplierName === product.OtherInformation.SupplierName})

          if (exist !== null || exist !== undefined) {
            this.BrandInformations.push(product.OtherInformation)
          }
        }
      })
      .catch(err => {

      })
    },
    setOtherInfomtaion () {
      var data = this.BrandInformations.filter(data => {return data.SupplierName === this.SupplierName[0] })

      var brandInformation = data[0]

      this.SupplierAddress = brandInformation.SupplierAddress
      this.SupplierEmail = brandInformation.SupplierEmail
      this.SupplierContactNumber = brandInformation.SupplierContactNumber

    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.Name.$dirty) return errors
      !this.$v.Name.required && errors.push('Name is required')
      !this.$v.Name.minLength && errors.push('Minimum length of 3')
      return errors
    },
    skuErrors () {
      const errors = []
      if (!this.$v.SKU.$dirty) return errors
      !this.$v.SKU.required && errors.push('Name is required')
      return errors
    },
    descriptionErrors () {
      const errors = []
      if (!this.$v.Description.$dirty) return errors
      !this.$v.Description.required && errors.push('Description is required')
      !this.$v.Description.minLength && errors.push('Minimum length of 6')
      return errors
    },
    categoryErrors () {
      const errors = []
      if (!this.$v.Category.$dirty) return errors
      !this.$v.Category.required && errors.push('Category is required')
      return errors
    },
    productTypesErrors () {
      const errors = []
      if (!this.$v.ProductType.$dirty) return errors
      !this.$v.ProductType.required && errors.push('ProductType is required')
      return errors
    },
    amountErrors () {
      const errors = []
      if (!this.$v.Amount.$dirty) return errors
      !this.$v.Amount.required && errors.push('Amount is required')
      return errors
    },
    supplierNameErrors () {
      const errors = []
      if (!this.$v.SupplierName.$dirty) return errors
      !this.$v.SupplierName.required && errors.push('Supplier Name is required')
      return errors
    },
    supplierAddressErrors () {
      const errors = []
      if (!this.$v.SupplierAddress.$dirty) return errors
      !this.$v.SupplierAddress.required && errors.push('Supplier Address is required')
      return errors
    },
    supplierEmailErrors () {
      const errors = []
      if (!this.$v.SupplierEmail.$dirty) return errors
      !this.$v.SupplierEmail.required && errors.push('Supplier Address is required')
      !this.$v.SupplierEmail.email && errors.push('Invalid Email Address')
      return errors
    },
    validForm () {
      return this.$v.$invalid
    },
    clearForm () {
      return this.clearData
    },
    IdToEdit () {
      return this.id
    }
  },
  watch: {
    validForm (value) {

      if (value) {

          this.$emit('isValid',false)
      }
      else {
          for (let i in this.Data) {
            this.Data[i] = this[i]
          }
          for (let i in this.OtherInformation) {
            this.OtherInformation[i] = this[i]
          }
          for (let i in this.Price) {
            this.Price[i] = this[i]
          }
          this.Data['OtherInformation'] = this.OtherInformation
          this.Data['Price'] = this.Price
          if (this._id !== null || this._id !== undefined) {
            this.Data['_id'] = this._id
          }
          this.$emit('isValid',true)
          this.$emit('dataEmit',this.Data)
      }
    },
    IdToEdit (value) {
      this.SpecificationItem = []
      this.Specification = {}
      if (value !== null || value !== undefined) {
        axios({
          method: 'get',
          url: 'http://5ab1b8cd.ngrok.io/api/v1/products/' + value,
          params: {
            Context: localStorage.getItem('Context')
          }
        })
          .then(response =>{
            var modelItem = response.data.model
            for (let prop in modelItem) {
              this[prop] = modelItem[prop]
            }
            for (let prop in modelItem.OtherInformation) {
              this[prop] = modelItem.OtherInformation[prop]
            }
            for (let prop in modelItem.Price) {
              this[prop] = modelItem.Price[prop]
            }
            for (let prop in response.data.model.Specification) {
              var propName = prop
              this.SpecificationItem.push(propName)
              var data = modelItem.Specification[prop]
              this.Specification[propName] = data

            }
            for (let prop in this.Specification) {
              this.Specification[prop] = modelItem.Specification[prop]
            }
          })
      }
    },
    clearForm (value) {

      this.Name= ''
      this.Description= ''
      this.Features= ''
      this.SKU= ''
      this.SupplierName= ''
      this.SupplierAddress= ''
      this.SupplierContactNumber= ''
      this.SupplierEmail= ''
      this.ProductType= ''
      this.Category= ''
      this.Amount= ''
      this.Currency= ''
      this.Images= []
    },
    refresh (value) {
      this.refreshAll()
    },
    Category (value) {
      this.Specification = {}
      this.SpecificationItem = []
      axios({
        method: 'get',
        url: 'http://5ab1b8cd.ngrok.io/api/v1/specification/' + value,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
        }
      })
        .then(response => {
          var specification = response.data.model

          for (let item in specification.SpecificationItem){
            this.Specification[specification.SpecificationItem[item]] = ''

          }
          this.SpecificationItem = response.data.model.SpecificationItem

        })
        .catch(err => {

        })
    }
  }
}
</script>

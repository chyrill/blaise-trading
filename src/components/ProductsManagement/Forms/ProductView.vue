<template>
  <v-container grid-md-list>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item v-for="(value, i) in Product.Images" v-bind:src="value" :key="i"></v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex xs4>
        <v-subheader><strong>Product Name:</strong></v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field disabled :value="Product.Name"> </v-text-field>
      </v-flex>
      <v-flex xs8 v-if="forAdmin">
        <v-flex xs4>
        <v-subheader><strong>SKU:</strong></v-subheader>
      </v-flex>
        <v-text-field disabled :value="Product.SKU"> </v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-subheader><strong>Category:</strong></v-subheader>
      </v-flex>
      <v-flex xs4>
        <v-text-field disabled :value="Product.Category">{{Product.Category}}</v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-subheader><strong>Product Type:</strong></v-subheader>
      </v-flex>
      <v-flex xs4>
        <v-text-field disabled :value="Product.ProductType"></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-subheader><strong>Description:</strong></v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field multi-line disabled :value="Product.Description"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-divider></v-divider>
        <h2>Specification</h2>
      </v-flex>
      <template v-for="(value, propName) in Product.Specification">
        <v-flex xs2>
          <v-subheader><strong>{{propName}}:</strong></v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-text-field :value="value" disabled></v-text-field>
        </v-flex>
      </template>
      <template v-if="forAdmin">
        <v-flex xs12>
          <v-divider></v-divider>
          <h2>Product Price</h2>
        </v-flex>
        <v-flex xs2>
          <v-subheader><strong>Currency:</strong></v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-text-field disabled :value="Product.Price.Currency"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-subheader><strong>Amount:</strong></v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-text-field disabled :value="Product.Price.Amount"></v-text-field>
        </v-flex>
      </template>
      <template v-if="forAdmin">
        <v-flex xs12>
          <v-divider></v-divider>
          <h2>Product Supplier Information</h2>
        </v-flex>
        <v-flex xs4>
          <v-subheader><strong>Company Name:</strong></v-subheader>
        </v-flex>
        <v-flex xs8>
          <v-text-field :value="Product.OtherInformation.SupplierName" disabled/>
        </v-flex>
         <v-flex xs4>
          <v-subheader><strong>Company Address:</strong></v-subheader>
        </v-flex>
        <v-flex xs8>
          <v-text-field :value="Product.OtherInformation.SupplierAddress" disabled/>
        </v-flex>
         <v-flex xs2>
          <v-subheader><strong>Contact Number:</strong></v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-text-field disabled :value="Product.OtherInformation.SupplierContactNumber"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-subheader><strong>Email:</strong></v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-text-field disabled :value="Product.OtherInformation.SupplierEmail"></v-text-field>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>


<script>
import axios from 'axios'

export default {
  name: 'ProductView',
  props: ['id'],
  data () {
    return {
      Product: {},
      forAdmin: localStorage.getItem('forAdmin')
    }
  },
  computed: {
    changeId () {
      return this.id
    }
  },
  watch: {
    changeId (value) {
     axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/' + this.id,
      params: {
        Context: localStorage.getItem('Context')
      }
    })
      .then(response => {
        this.Product = response.data.model
        console.log(this.Product)
      })
    }
  },
  mounted () {
    axios({
      method: 'get',
      url: 'http://5ab1b8cd.ngrok.io/api/v1/products/' + this.id,
      params: {
        Context: localStorage.getItem('Context')
      }
    })
      .then(response => {
        this.Product = response.data.model
        console.log(this.Product)
      })
  }
}
</script>

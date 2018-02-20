<template>
  <div>
    <v-card>
      <v-form>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Company Name" v-model="CompanyName" :error-messages="companyNameErrors" @input="$v.CompanyName.$touch()" @blur="$v.CompanyName.$touch()" required/>
      </v-flex>
      <div v-if="DeviceWidth >= 760">
       <v-flex xs10 offset-xs1>
        <v-layout>
          <v-flex xs6>
        <v-text-field label="Line of Business" v-model="LineOfBusiness" />
      </v-flex>
    <v-flex xs6>
      <v-select label="Sector" v-model="Sector"  :items="SectorItems" :error-messages="sectorErrors" @input="$v.Sector.$touch()" @blur="$v.Sector.$touch()" required/>
  </v-flex>
      </v-layout>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout>
          <v-flex xs6>
            <v-text-field label="Address 1" v-model="Address1" :error-messages="address1Errors" @input="$v.Address1.$touch()" @blur="$v.Address1.$touch()" required />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Address 2" v-model="Address2"/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout>
          <v-flex xs4>
              <v-select v-bind:items="Cities" v-model="City" label="City" :error-messages="cityErrors" @input="$v.City.$touch()" @blur="$v.City.$touch()" required autocomplete tags></v-select>
<!--               <v-text-field label="City" v-model="City" :error-messages="cityErrors" @input="$v.City.$touch()" @blur="$v.City.$touch()" required />-->
          </v-flex>
          <v-flex xs4>
               <v-select v-bind:items="States" v-model="State" label="State" :error-messages="stateErrors" @input="$v.State.$touch()" @blur="$v.State.$touch()" required autocomplete tags></v-select>
<!--            <v-text-field label="State" v-model="State" :error-messages="stateErrors" @input="$v.State.$touch()" @blur="$v.State.$touch()" required />-->
          </v-flex>
          <v-flex xs4>
              <v-select v-bind:items="Countries" v-model="Country" label="State" :error-messages="countryErrors" @input="$v.Country.$touch()" @blur="$v.Country.$touch()" required autocomplete tags></v-select>
<!--            <v-text-field label="Country" v-model="Country" :error-messages="countryErrors" @input="$v.Country.$touch()" @blur="$v.Country.$touch()" required />-->
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-layout>
          <v-flex xs6>
            <v-text-field label="Company Landline" v-model="PhoneNumber" mask="(##)###-####" :error-messages="phoneNumberErrors" @input="$v.PhoneNumber.$touch()" @blur="$v.PhoneNumber.$touch()" required />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Zip Code" v-model="ZipCode" mask="#####" :error-messages="zipCodeErrors" @input="$v.ZipCode.$touch()" @blur="$v.ZipCode.$touch()" required />
          </v-flex>
        </v-layout>
      </v-flex>
    </div>
    </v-form>
    </v-card>
    <v-btn @click="cancel"><v-icon left>navigate_before</v-icon>Back</v-btn> <v-btn @click="submit" color="indigo" :disabled="$v.$invalid">Submit<v-icon right>send</v-icon></v-btn>
  </div>
</template>

<script>
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength
} from 'vuelidate/lib/validators'

import axios from 'axios'    
    
export default {
  mixins: [validationMixin],
  validations: {
    CompanyName: {
      required,
      minLength: minLength(5)
    },
    Address1: {
      required
    },
    City: {
      required
    },
    State: {
      required
    },
    Country: {
      required
    },
    ZipCode: {
      required
    },
    PhoneNumber: {
      required
    },
    Sector: {
      required
    }
  },
  name: 'CompanyInformationForm',
  data () {
    return {
      Cities: [],
      Countries: [],
      States: [],
      DeviceWidth: document.documentElement.clientWidth,
      CompanyName: '',
      Sector: '',
      LineOfBusiness: '',
      Address1: '',
      Address2: '',
      City: '',
      State: '',
      Country: '',
      ZipCode: '',
      PhoneNumber: '',
      Data: {
        CompanyName: '',
        Sector: '',
        LineOfBusiness: '',
        Address1: '',
        Address2: '',
        City: '',
        State: '',
        Country: '',
        ZipCode: '',
        PhoneNumber: ''
      },
      SectorItems: ['Private', 'Government']
    }
  },
  ready: function () {
    window.addEventListener('resize', this.handleResize)
  },
  mounted () {
    axios.get('http://1510ec71.ngrok.io/api/v1/city')
      .then(response => {
        for (let item in response.data.items){
            this.Cities.push(response.data.items[item].Name)
        }
    })
    axios.get('http://1510ec71.ngrok.io/api/v1/state')
      .then(response => {
        for (let item in response.data.items) {
            this.States.push(response.data.items[item].Name)
        }
    })
    axios.get('http://1510ec71.ngrok.io/api/v1/country')
      .then(response => {
        for (let item in response.data.items) {
            this.Countries.push(response.data.items[item].Name)
        }
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    companyNameErrors () {
      const errors = []
      if (!this.$v.CompanyName.$dirty) return errors
      !this.$v.CompanyName.required && errors.push('Company Name is required')
      !this.$v.CompanyName.minLength && errors.push('Company name minimum length is 5')
      return errors
    },
    sectorErrors () {
      const errors = []
      if (!this.$v.Sector.$dirty) return errors
      !this.$v.Sector.required && errors.push('Sector is required')
      return errors
    },
    address1Errors () {
      const errors = []
      if (!this.$v.Address1.$dirty) return errors
      !this.$v.Address1.required && errors.push('Address 1 is required')
      return errors
    },
    cityErrors () {
      const errors = []
      if (!this.$v.City.$dirty) return errors
      !this.$v.City.required && errors.push('City is required')
      return errors
    },
    stateErrors () {
      const errors = []
      if (!this.$v.State.$dirty) return errors
      !this.$v.State.required && errors.push('State is required')
      return errors
    },
    countryErrors () {
      const errors = []
      if (!this.$v.Country.$dirty) return errors
      !this.$v.Country.required && errors.push('Country is required')
      return errors
    },
    phoneNumberErrors () {
      const errors = []
      if (!this.$v.PhoneNumber.$dirty) return errors
      !this.$v.PhoneNumber.required && errors.push('Phone Number is required')
      return errors
    },
    zipCodeErrors () {
      const errors = []
      if (!this.$v.ZipCode.$dirty) return errors
      !this.$v.ZipCode.required && errors.push('Zip Code is required')
      return errors
    }
  },
  methods: {
    handleResize () {
      this.DeviceWidth = document.documentElement.clientWidth
    },
    cancel () {
      this.$emit('back', 2)
    },
    submit () {
      for (let key in this.Data) {
        this.Data[key] = this[key]
      }
      this.$emit('submit', this.Data)
    }
  }
}
</script>

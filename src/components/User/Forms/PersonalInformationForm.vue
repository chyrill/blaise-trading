<template>
  <div>
  <v-card>
    <form>
      <v-container grid-list-xs text-xs-center>
        <v-flex xs10 offset-xs1>
          <div v-if="!withPicture">
            <img src="http://d5b38b09.ngrok.io/uploads/customer-512-1514938254632.png" style="width:200px;height:200px;border-radius:50%" />
          </div>
          <div v-else>
            <img :src="ProfilePicture" style="width:200px;height:200px;border-radius:50%" />
          </div>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <input type="file" name="ProfilePicture" id="uploaddata" @change="getPicture" ref="fileInput" hidden />
          <v-btn color="indigo" @click="triggerFile">Upload Picture</v-btn>
        </v-flex>
      </v-container>
    </form>
    <v-form>
      <v-container grid-list-xs>
        <v-flex xs10 offset-xs1>
          <v-text-field label="Last Name" v-model="LastName" :error-messages="lastNameErrors" @input="$v.LastName.$touch()" @blur="$v.LastName.$touch()" required></v-text-field>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field label="First Name" v-model="FirstName" :error-messages="firstNameErrors" @input="$v.FirstName.$touch()" @blur="$v.FirstName.$touch()" required></v-text-field>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field label="Middle Name" v-model="MiddleName"></v-text-field>
        </v-flex>
        <div v-if="DeviceHeight >= 760">
        <v-flex xs10 offset-xs1>
          <v-layout>
          <v-flex xs6>
            <v-text-field label="Address 1" v-model="Address1" :error-messages="address1Errors" @input="$v.Address1.$touch()" @blur="$v.Address1.$touch()" ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Address 2" v-model="Address2" ></v-text-field>
          </v-flex>
        </v-layout>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-layout>
            <v-flex xs4>
              <v-select v-bind:items="Cities" label="City" v-model="City" :error-messages="cityErrors" @input="$v.City.$touch()" @blur="$v.City.$touch()" required autocomplete tags></v-select>
<!--              <v-text-field label="City" v-model="City" :error-messages="cityErrors" @input="$v.City.$touch()" @blur="$v.City.$touch()" required></v-text-field>-->
            </v-flex>
            <v-flex xs4>
              <v-select v-bind:items="States" label="State" v-model="State" :error-messages="stateErrors" @input="$v.State.$touch()" @blur="$v.State.$touch()" required autocomplete tags></v-select>
<!--              <v-text-field label="State" v-model="State" :error-messages="stateErrors" @input="$v.State.$touch()" @blur="$v.State.$touch()" required></v-text-field>-->
            </v-flex>
            <v-flex xs4>
                <v-select v-bind:items="Countries" label="Country" v-model="Country" :error-messages="countryErrors" @input="$v.Country.$touch()" @blur="$v.Country.$touch()" required autocomplete tags></v-select>
<!--              <v-text-field label="Country" v-model="Country" :error-messages="countryErrors" @input="$v.Country.$touch()" @blur="$v.Country.$touch()" required ></v-text-field>-->
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-layout>
            <v-flex xs4>
              <v-text-field label="Mobile Number" v-model="MobileNumber" mask="+63##########" :error-messages="mobileNumberErrors" @input="$v.MobileNumber.$touch()" @blur="$v.MobileNumber.$touch()" required></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="Phone Number" mask="(##)###-####" v-model="PhoneNumber"></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field label="Zip Code" v-model="ZipCode" mask="#####" :error-messages="zipCodeErrors" @input="$v.ZipCode.$touch()" @blur="$v.ZipCode.$touch()" required ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </div>
      </v-container>
    </v-form>
  </v-card>
  <v-btn @click="cancel"><v-icon left>navigate_before</v-icon> back</v-btn>  <v-btn color="indigo" @click="submit":disabled="$v.$invalid">next<v-icon right>navigate_next</v-icon></v-btn>
  <v-snackbar :timeout="snackbar.timeout" color="red" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} </v-snackbar>
</div>
<!-- <v-snackbar :timeout="snackbar.timeout" color="red" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} </v-snackbar> -->
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
    LastName: {
      required,
      minLength: minLength(2)
    },
    FirstName: {
      required,
      minLength: minLength(2)
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
    MobileNumber: {
      required
    },
    ZipCode: {
      required
    }
  },
  name: 'PersonalInformationForm',
  data () {
    return {
      States: [],
      Countries: [],
      Cities: [],
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false
      },
      Errors: '',
      LastName: '',
      FirstName: '',
      MiddleName: '',
      Address1: '',
      Address2: '',
      DeviceHeight: document.documentElement.clientWidth,
      City: '',
      State: '',
      Country: '',
      MobileNumber: '',
      PhoneNumber: '',
      ZipCode: '',
      withPicture: false,
      ProfilePicture: '',
      InputPicture: '',
      Data: {
        LastName: '',
        FirstName: '',
        MiddleName: '',
        Address1: '',
        Address2: '',
        City: '',
        State: '',
        Country: '',
        MobileNumber: '',
        PhoneNumber: '',
        ZipCode: '',
        ProfilePicture: ''
      },
    }
  },
  ready: function () {
    window.addEventListener('resize', this.HandleResize)
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
    window.removeEventListener('resize', this.HandleResize)
  },
  computed: {
    lastNameErrors () {
      const errors = []
      if (!this.$v.LastName.$dirty) return errors
      !this.$v.LastName.required && errors.push('Last Name is required')
      !this.$v.LastName.minLength && errors.push('Last Name minimum length is 2')
      return errors
    },
    firstNameErrors () {
      const errors = []
      if (!this.$v.FirstName.$dirty) return errors
      !this.$v.FirstName.required && errors.push('First Name is required')
      !this.$v.FirstName.minLength && errors.push('First Name minimum length is 2')
      return errors
    },
    middleNameErrors () {

    },
    address1Errors () {
      const errors = []
      if (!this.$v.Address1.$dirty) return errors
      !this.$v.Address1.required && errors.push('Address 1 is required')
      return errors
    },
    address2Errors () {

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
      !this.$v.State.required && errors.push('City is required')
      return errors
    },
    countryErrors () {
      const errors = []
      if (!this.$v.Country.$dirty) return errors
      !this.$v.Country.required && errors.push('City is required')
      return errors
    },
    mobileNumberErrors () {
      const errors = []
      if (!this.$v.MobileNumber.$dirty) return errors
      !this.$v.MobileNumber.required && errors.push('Mobile Number is required')
      return errors
    },
    phoneNumberErrors () {

    },
    zipCodeErrors () {
      const errors = []
      if (!this.$v.ZipCode.$dirty) return errors
      !this.$v.ZipCode.required && errors.push('Zip Code is required')
      return errors
    }
  },
  methods: {
    HandleResize (event) {
      this.DeviceHeight = document.documentElement.clientWidth
    },
    submit () {
      for (let key in this.Data) {
        this.Data[key] = this[key]
      }
      this.$emit('submit', this.Data)
    },
    cancel () {
      this.$emit('cancel', 1)
    },
    triggerFile () {
      this.$refs.fileInput.click()
    },
    getPicture (e) {
      var data = e.target.files || e.dataTransfer.files
      var filename = data[0].name
      var split = filename.split('.')
      var extname = split[split.length - 1]
      var imageList = [ 'png', 'jpeg', 'jpg' ]
      var letmesee = imageList.indexOf(extname)
      if (letmesee < 0) {
        document.getElementById('uploaddata').value = ''
        this.Snackbar = true
        this.Errors = 'You can only upload an image file'
      }
      else {
        const formData = new FormData()
        formData.set('uploaddata',data[0])
        axios.post('http://1510ec71.ngrok.io/api/v1/upload', formData)
          .then(response => {
            this.ProfilePicture = response.data.model
            this.withPicture = true
          })
          .catch(err => {
            this.Snackbar = true
            this.Errors = err.data.message
          })
      }
    }
  }
}
</script>

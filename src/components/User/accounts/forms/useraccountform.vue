<template>
  <v-container fluid grid-md-list>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>User Account Information</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            <img :src="ProfilePicture" style="width:200px;height:200px;border-radius:50%" />
          </v-flex>
          <v-flex xs10 offset-xs1>
            <input type="file" name="ProfilePicture" id="uploaddata" hidden ref="fileUpload" @change="uploadFile" />
            <v-btn color="indigo" dark @click="tickFileUpload"><v-icon left>image</v-icon>Upload Image</v-btn>
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-text-field label="Email Address" v-model="Email" :error-messages="emailErrors" @input="$v.Email.$touch()" @blur="$v.Email.$touch()"/>
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-text-field type="password" v-model="Password" :error-messages="passwordErrors" @input="$v.Password.$touch()" @blur="$v.Password.$touch()" label="Password" />
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-text-field label="Last Name" v-model="LastName" :error-messages="lastNameErrors" @input="$v.LastName.$touch()" @blur="$v.LastName.$touch()" />
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-text-field label="First Name" />
          </v-flex>
          <v-flex xs4 offset-xs1>
            <v-text-field label="Middle Name" />
          </v-flex>
          <v-flex xs5 offset-xs1>
            <v-select v-bind:items="accessLevels" item-text="text" item-value="value" label="Access Level"></v-select>
          </v-flex>
          <v-flex xs4 offset-xs1>
            <v-text-field label="Address 1" />
          </v-flex>
          <v-flex xs5 offset-xs1>
            <v-text-field label="Address 2" />
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-layout row wrap>
              <v-flex xs4>
                <v-select label="City" />
              </v-flex>
              <v-flex xs4>
                <v-select label="State" />
              </v-flex>
              <v-flex xs4>
                <v-select label="Country" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4 offset-xs1>
            <v-text-field mask="+63##########" label="Mobile Phone" />
          </v-flex>
          <v-flex xs5 offset-xs1>
            <v-text-field mask="#####" label="Zip Code" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
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
    name: 'UserAccountForm',
    mixins: [validationMixin],
    validations: {
      Email: {
        required,
        email
      },
      Password: {
        required,
        minLength: minLength(6)
      },
      LastName: {
        required,
        minLength: minLength(2)
      },
      FirstName: {
        required,
        minLength: minLength(2)
      },
      Address1: {
        required,
        minLength: minLength(6)
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
      PhoneNumber: {
        required
      }
    },
    data () {
      return {
        ProfilePicture: '',
        accessLevels: [
          {
            text: "Administrator",
            value: 1
          },
          {
            text: "Sales Manager",
            value: 2
          },
          {
            text: "Sales Agent",
            value: 3
          }
        ],
        AccessLevel: '',
        Email: '',
        Password: '',
        LastName: '',
        FirstName: '',
        MiddleName: '',
        City: '',
        State: '',
        Country: '',
        ZipCode: '',
        PhoneNumber: '',
        Address1: '',
        Address2: '',
        Data: {
          AccessLevel: '',
          Email: '',
          Password: '',
          LastName: '',
          FirstName: '',
          MiddleName: '',
          City: '',
          State: '',
          Country: '',
          ZipCode: '',
          PhoneNumber: '',
          Address1: '',
          Address2: ''
        }
      }
    },
    methods: {
      tickFileUpload () {
        this.$refs.fileUpload.click()
      },
      uploadFile (e) {
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
    },
    mounted () {

    },
    watch () {

    },
    computed: {
      emailErrors () {
        const errors= []
        if (!this.$v.Email.$dirty) return errors
        !this.$v.Email.required && errors.push('Email is required')
        !this.$v.Email.email && errors.push('Invalid Email')
        return errors
      }
    }
  }
</script>

<template>
<v-container grid-list-md>
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <v-card color="primary">
        <v-card-text class="text-xs-center">
          <h2 style="color:#ffffff">Create Account</h2></v-card-text>
        <v-divider></v-divider>
        <v-stepper v-model="Stepper"  vertical>
          <v-stepper-step step="1" v-bind:complete="Stepper > 1">
            Login Credentials
          </v-stepper-step>
          <v-stepper-content step="1">
            <LoginDetailsForm @submit="getData" />
          </v-stepper-content>
          <v-stepper-step step="2" :complete ="Stepper > 2">
            Personal Information
          </v-stepper-step>
          <v-stepper-content step="2">
            <PersonalInformationForm @submit="submitPersonal" @cancel="cancel1"/>
          </v-stepper-content>
          <v-stepper-step step="3">
            Company Information
          </v-stepper-step>
          <v-stepper-content step="3">
            <CompanyInformationForm @back ="cancel2" @submit="submitAll"/>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-flex>
  </v-layout>
  <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} <v-spacer></v-spacer> <v-icon dark>{{snackbar.actions}}</v-icon> </v-snackbar>
</v-container>
</template>

<script>
import LoginDetailsForm from './Forms/LoginDetailsForm'
import PersonalInformationForm from './Forms/PersonalInformationForm'
import CompanyInformationForm from './Forms/CompanyInformationForm'
import axios from 'axios'

export default {
  name: 'SignUp',
  data () {
    return {
      Stepper: 1,
      LoginDetails: {},
      PersonalInformation: {},
      Others: {},
      Data: {},
      Errors: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: true,
        vertical: true,
        actions: '',
        color: ''
      }
    }
  },
  computed: {
    context () {
      this.Data['Context'] = this.$store.getters.getContext
    }
  },
  methods: {
    getData (value) {
      this.LoginDetails = value
      this.Stepper = 2
    },
    submitPersonal (value) {
      this.PersonalInformation = value
      this.Stepper = 3
    },
    cancel1 (value) {
      this.Stepper = value
    },
    cancel2 (value) {
      this.Stepper = value
    },
    submitAll (value) {
      this.Others = value
      for (let key in this.LoginDetails) {
        this.Data[key] = this.LoginDetails[key]
      }
      for (let key in this.PersonalInformation) {
        this.Data[key] = this.PersonalInformation[key]
      }
      this.Data['Context'] = this.$store.getters.getContext
      this.Data['Others'] = this.Others
      this.Data['AccessLevel'] = 4
      
      this.checkIfExist()
    },
    checkIfExist () {
      axios({
          method: 'post',
          url: 'http://d4cebfbf.ngrok.io/api/v1/userInfo/exist',
          data: {
            Context: this.Data.Context,
            Email: this.Data.Email,
            FirstName: this.Data.FirstName,
            LastName: this.Data.LastName
          }
      })
      .then (response => {
          this.createRecipient()
      })
      .catch (err => {
        this.Errors = err.response.data.message
        this.snackbar.color = 'red'
        this.snackbar.actions = 'close'
        this.Snackbar = true
      })
  },
    createRecipient () {
      axios({
          method: 'post',
          url: 'http://2726d92e.ngrok.io/api/v1/recipient',
          data: {
              Name: this.Data.LastName + ', ' + this.Data.FirstName,
              Context: this.Data.Context,
              Email: this.Data.Email,
              PhoneNumber: this.Data.MobileNumber
          }
      })
      .then (response => {
          this.createUser(response.data.model._id)
      })
      .catch (err => {
      })
    },
    createUser (contactId) {
        this.Data['ContactId'] = contactId
        var payload = this.Data
        axios({
            method: 'post',
            url: 'http://d4cebfbf.ngrok.io/api/v1/userLogin/signup',
            data: this.Data,
        })
        .then (response => {
            var user = response.data.model.User
            console.log(user)
            var loginId = response.data.model.UserLoginId
            this.Errors = 'Please verify your email'
            this.snackbar.color = 'gray'
            this.snackbar.actions = 'check'
            this.Snackbar = true
            this.sendEmailVerification(user, loginId)
        })
        .catch (err => {
        })
    },
    sendEmailVerification (user, loginId) {
       axios({
           method: 'post',
           url: 'http://2726d92e.ngrok.io/api/v1/notify/sendSimple',
           data: {
               NotificationTemplateId: '5a6fce0237bb14714ca1373c',
               Payload: {
                   Link: 'http://blaise-scientific-trading.herokuapp.com/confirmemail/' + loginId,
                   Name: this.Data.LastName + ', ' + this.Data.FirstName
               },
               RecipientId: user.ContactId
           },
           headers: {
               'Authorization' : 'Bearer ' + user.AuthCode
           }
       })
       .then (response => {
          this.saveToLeadManagement()
       })
       .catch (err => {
       })
    },
    saveToLeadManagement () {
      let payload = {
        FirstName: this.Data.FirstName,
        LastName: this.Data.LastName,
        Address: this.Data.Address1 + ', ' + this.Data.Address2 + ', ' + this.Data.City + ', ' + this.Data.State + ', ' + this.Data.Country,
        MobileNumber: this.Data.MobileNumber,
        Context: localStorage.getItem('Context'),
        Email: this.Data.Email
      }

      axios({
        method: 'post',
        url: 'http://c54d8915.ngrok.io/api/v1/client',
        data: payload
      })
      .then(response => {
        this.$router.push('/')
      })
      .catch(err => {
        
      })
    }
  },
  components: {
    LoginDetailsForm,
    PersonalInformationForm,
    CompanyInformationForm
  }
}
</script>

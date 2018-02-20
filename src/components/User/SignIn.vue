<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card >
          <v-card-text class="text-xs-center">
            <h2>Sign In</h2>

          </v-card-text>
              <SignInForm @submit="submit"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" :top="snackbar.top" :multi-line="snackbar.multi" :vertical="snackbar.vertical" v-model="Snackbar"> {{Errors}} <v-spacer></v-spacer> <v-icon dark>{{snackbar.actions}}</v-icon></v-snackbar>
  </v-container>
</template>

<script>
import SignInForm from './Forms/SignInForm'
import axios from 'axios'

export default {
  name: 'SignIn',
  data () {
    return {
      Errors: '',
      Snackbar: false,
      snackbar: {
        timeout: 6000,
        top: true,
        multi: false,
        vertical: false,
        actions: '',
        color: ''
      }
    }
  },
  components: {
    SignInForm
  },
  computed: {
    User () {
      return this.$store.getters.getUser
    },
    ConfirmEmail () {
       return this.$store.getters.getConfirmEmail
    }
  },
  watch: {
    User (value) {
      if (value.AccessLevel !== 4) {
        this.$router.push('/admin/dashboard')
      }
      else {
        this.$router.push('/')
      }
    },
    ConfirmEmail () {
      this.snackbar.color = 'red'
      this.snackbar.actions = 'close'
      this.Errors = 'Please verify your email.'
      this.Snackbar = !this.Snackbar
    }
  },
  methods: {
    submit (value) {
      value['Context'] = this.$store.getters.getContext
      axios.post('http://d4cebfbf.ngrok.io/api/v1/userLogin/login',value)
        .then( response => {
             this.$store.dispatch('signInjwtdecode', response.data.model.Token)

        })
        .catch( err => {
          this.Errors = err.response.data.message
          this.Snackbar = true
        })
    }
  }
}
</script>

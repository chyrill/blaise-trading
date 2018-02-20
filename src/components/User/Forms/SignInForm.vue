<template>
<div>
  <v-form style="padding-bottom:10px">
    <v-container grid-list-xs>
      <v-flex xs10 offset-xs1>
        <v-text-field v-model="Email" label="Email Address" required :error-messages="emailErrors" append-icon="email"  @input="$v.Email.$touch()" @blur="$v.Email.$touch()" />
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field type="password" v-model="Password" label="Password" required :error-messages="passwordErrors" append-icon="vpn_key"  @input="$v.Password.$touch()" @blur="$v.Password.$touch()" />
      </v-flex>
    </v-container>
    <v-btn color="indigo" @click="submit" :disabled="$v.$invalid">Log In <v-icon right>send</v-icon></v-btn> <v-btn color="red" @click="clear">Clear <v-icon right>remove</v-icon></v-btn>
  </v-form >
</div>
</template>

<script>
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email
} from 'vuelidate/lib/validators'

export default {
  name: 'SignInForm',
  mixins: [validationMixin],
  validations: {
    Email: {
      required,
      email
    },
    Password: {
      required,
      minLength: minLength(6)
    }
  },
  data () {
    return {
      Email: '',
      Password: '',
      Data: {
        Email: '',
        Password: ''
      }
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.Email.$dirty) return errors
      !this.$v.Email.required && errors.push('Email is required')
      !this.$v.Email.email && errors.push('Invalid Email')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.Password.$dirty) return errors
      !this.$v.Password.required && errors.push('Password is required')
      !this.$v.Password.minLength && errors.push('Password minimum length is 6')
      return errors
    }
  },
  methods: {
    submit () {
      for (let key in this.Data) {
        this.Data[key] = this[key]
      }

      this.$emit('submit', this.Data)
    },
    clear () {
      this.Email = ''
      this.Password = ''
    }
  }
}
</script>

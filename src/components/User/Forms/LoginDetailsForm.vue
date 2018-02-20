<template>
  <div>
  <v-card>
  <v-form ref="form" lazy-validation>
    <v-container grid-list-xs>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Email" v-model="Email" :error-messages="emailErrors" @input="$v.Email.$touch()" @blur="$v.Email.$touch()" required></v-text-field>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Password" type="password" v-model="Password" :error-messages="passwordErrors" @input="$v.Password.$touch()" @blur="$v.Password.$touch()" required></v-text-field>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-text-field label="Confirm Password" type="password" v-model="ConfirmPassword" :error-messages="confirmPasswordErrors" @input="$v.ConfirmPassword.$touch()" @blur="$v.ConfirmPassword.$touch()" required></v-text-field>
      </v-flex>
    </v-container>
  </v-form>
</v-card>
<v-btn color="indigo" @click="submit()" :disabled="$v.$invalid">Next <v-icon right>navigate_next</v-icon></v-btn>
</div>
</template>

<script>
import {
  validationMixin
} from 'vuelidate'

import {
  required,
  minLength,
  email,
  sameAs
} from 'vuelidate/lib/validators'

export default {
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
    ConfirmPassword: {
      required,
      minLength: minLength(6),
      samePassword: sameAs('Password')
    }
  },
  name: 'LoginDetailsForm',
  data () {
    return {
      Email: '',
      Password: '',
      ConfirmPassword: '',
      Data: {

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
    },
    confirmPasswordErrors () {
      const errors = []
      if (!this.$v.ConfirmPassword.$dirty) return errors
      !this.$v.ConfirmPassword.required && errors.push('Confirm password is required')
      !this.$v.ConfirmPassword.minLength && errors.push('Confirm password minimum length is 6')
      !this.$v.ConfirmPassword.samePassword && errors.push("Password doesn't match")
      return errors
    }
  },
  methods: {
    submit () {
      this.Data.Email = this.Email
      this.Data.Password = this.Password
      this.$emit('submit',
        this.Data
      )
    }
  }
}
</script>

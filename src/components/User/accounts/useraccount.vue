<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>User Accounts</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-data-table v-bind:headers="accountHeaders" :items="userAccounts" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{props.item.LastName}}</td>
          <td>{{props.item.FirstName}}</td>
          <td>{{props.item.Email}}</td>
          <td>{{props.item.DateCreated}}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" flat icon color="yellow"><v-icon>visibility</v-icon></v-btn>
              <span>view profile</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" flat icon color="red"><v-icon>delete</v-icon></v-btn>
              <span>delete profile</span>
            </v-tooltip>
          </td>
        </template>
        </v-data-table>
      </v-card-text>
      <v-btn fab absolute bottom right dark color="red" @click="openAddUserDialog"><v-icon>add</v-icon></v-btn>
    </v-card>
    <!-- dialog add user  -->
      <v-dialog v-model="addUserDialog" max-width="700">
          <UserAccountForm />
      </v-dialog>
    <!-- end of add user dialog -->
  </v-container>
</template>


<script>
  import axios from 'axios'
  import UserAccountForm from './forms/useraccountform'

  export default {
    name: 'UserAccount',
    data () {
      return {
        accountHeaders: [
          {
            text: 'Last Name',
            align: 'center',
            value: 'LastName'
          },
          {
            text: 'First Name',
            align: 'center',
            value: 'FirstName'
          },
          {
            text: 'Email',
            align: 'center',
            value: 'Email'
          },
          {
            text: 'Date Created',
            align: 'center',
            value: 'DateCreated '
          },
          {
            text: ''
          }
        ],
      userAccounts: [],
      addUserDialog: false
      }
    },
    methods: {
      openAddUserDialog () {
        this.addUserDialog = !this.addUserDialog
      },
      refreshAll () {
        axios({
          method: 'get',
          url: 'http://d4cebfbf.ngrok.io/api/v1/userInfo',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('AuthCode')
          }
        })
          .then(response => {
            this.userAccounts = response.data.items
          })
          .catch(err => {

          })
      }
    },
    mounted () {
      this.refreshAll()
    },
    watch () {

    },
    computed: {

    },
    components: {
      UserAccountForm
    }
  }
</script>

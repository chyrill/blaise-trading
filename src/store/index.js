import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'
import Uuid from 'uuid-lib'
import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    context: '5a43354f1a070f28107f806a',
    user: {},
    shoppingCart: {
      UserId: '',
      Items: [],
      CreatedBy: ''
    },
    defaultUser: '',
    confirmEmail: 1
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      state.defaultUser = ''
      state.shoppingCart.UserId = payload.UserId
      state.shoppingCart.CreatedBy = payload.Name
      localStorage.setItem('IsAuthenticated', true)
      localStorage.setItem('UserId', payload.UserId)
      if (payload.AccessLevel !== 4) {
        localStorage.setItem('forAdmin', true)
      }
      axios({
          method: 'get',
          url: 'http://8f466630.ngrok.io/api/v1/shoppingcart/' + payload.UserId
        })
        .then(response => {
          state.shoppingCart = response.data.model
        })
        .catch(err => {
          axios({
              method: 'post',
              url: 'http://8f466630.ngrok.io/api/v1/shoppingcart/',
              data: state.shoppingCart
            })
            .then(response => {
              state.shoppingCart = response.data.model
            })
        })
      sessionStorage.setItem('ShoppingCart', JSON.stringify(state.shoppingCart))
    },
    removeUser(state) {
      localStorage.setItem('IsAuthenticated', false)
      sessionStorage.removeItem('ShoppingCart')
      state.user = {}
      state.user['UserId'] = Uuid.create()
      localStorage.setItem('defaultUserId', state.user['UserId'])
      state.shoppingCart.Items = []
      state.shoppingCart.UserId = state.user.UserId
      state.shoppingCart.CreatedBy = 'Guest'
      state.defaultUser = state.user['UserId']
    },
    addDefaultUser(state, payload) {
      state.user['UserId'] = payload
      state.shoppingCart.Items = []
      state.shoppingCart.UserId = state.user.UserId
      state.shoppingCart.CreatedBy = 'Guest'
      state.defaultUser = payload
    },
    addItemToShoppingCart(state, payload) {
      var existItem = state.shoppingCart.Items.find(function(existItem) { return existItem._id === payload._id })
      console.log(existItem)
      if (existItem != null || existItem != undefined) {
        existItem.Quantity = parseInt(existItem.Quantity) + parseInt(payload.Quantity)
      } else {
        state.shoppingCart.Items.push(payload)
      }
      if (state.shoppingCart._id != null || state.shoppingCart._id != undefined) {

        axios({
            method: 'put',
            url: 'http://8f466630.ngrok.io/api/v1/shoppingcart',
            data: state.shoppingCart
          })
          .then(response => {
            state.shoppingCart = response.data.model
            state.shoppingCart.Items.push(payload)
            sessionStorage.setItem('ShoppingCart', JSON.stringify(state.shoppingCart))
          })
      }
      sessionStorage.setItem('ShoppingCart', JSON.stringify(state.shoppingCart))
    },
    createCart(state, payload) {
      state.shoppingCart.UserId = state.user.UserId
      if (state.defaultUser === null || state.defaultUser === undefined) {
        state.shoppingCart.CreatedBy = state.user.Name
      } else {
        state.shoppingCart.CreatedBy = 'Guest'
      }
      state.shoppingCart.Items.push(payload)
    },
    SetShoppingCart(state, payload) {
      state.shoppingCart = payload
    },
    removeItemInCart(state, payload) {
      var index = state.shoppingCart.Items.findIndex(x => x._id === payload)
      state.shoppingCart.Items.splice(index, 1)
      if (state.shoppingCart._id != null || state.shoppingCart._id != undefined) {
        axios({
            method: 'put',
            url: 'http://8f466630.ngrok.io/api/v1/shoppingcart/',
            data: state.shoppingCart
          })
          .then(response => {
            state.shoppingCart = response.data.model
            sessionStorage.setItem('ShoppingCart', JSON.stringify(state.shoppingCart))
          })
      }
      sessionStorage.setItem('ShoppingCart', JSON.stringify(state.shoppingCart))
    },
    requestForQoute(state) {
      axios({
          method: 'post',
          url: 'http://8f466630.ngrok.io/api/v1/quotation',
          data: {
            ShoppingCartId: state.shoppingCart._id,
            Customer: state.user
          },
          headers: {
            'Authorization': 'Bearer ' + state.user.AuthCode
          }
        })
        .then(response => {
          state.shoppingCart.Items = []
          state.shoppingCart.UserId = state.user.UserId
          state.shoppingCart.CreatedBy = state.user.Name
          axios({
              method: 'post',
              url: 'http://8f466630.ngrok.io/api/v1/shoppingcart/',
              data: state.shoppingCart
            })
            .then(response => {
              state.shoppingCart = response.data.model
            })
        })
    },
    setConfirmEmail(state) {
      state.confirmEmail += 1
    }
  },
  actions: {
    signInjwtdecode({ commit }, payload) {
      var data = jwt.verify(payload, 'blaiseSecretKey')
      if (!data.user.ConfirmEmail) {
        commit('setConfirmEmail')
      } else {
        var user = data.user;
        console.log(user)
        localStorage.setItem('Token', payload)
        localStorage.setItem('AuthCode', user.AuthCode)
        localStorage.setItem('ConfirmEmail', user.ConfirmEmail)
        localStorage.removeItem('defaultUserId')
        commit('setUser', user)
        this.$router.push('/')
      }
    },
    jwtdecode({ commit }, payload) {
      var data = jwt.verify(payload, 'blaiseSecretKey')
      localStorage.setItem('ContactId', data.user.ContactId)
      localStorage.setItem('AuthCode', data.user.AuthCode)
      localStorage.setItem('ConfirmEmail', data.user.ConfirmEmail)
      localStorage.removeItem('defaultUserId')
      commit('setUser', data.user)
    },
    logout({ commit }) {
      localStorage.removeItem('Token')
      commit('removeUser')
    },
    setDefaultUser({ commit }) {
      var defaultUserId = localStorage.getItem('defaultUserId')
      if (defaultUserId === null || defaultUserId === undefined) {
        console.log('shit')
        localStorage.setItem('defaultUserId', Uuid.create())
        commit('addDefaultUser', localStorage.getItem('defaultUserId'))
      } else
        commit('addDefaultUser', localStorage.getItem('defaultUserId'))
    },
    addItemToCart({ commit }, payload) {
      var shoppingCart = sessionStorage.getItem('ShoppingCart')
      if (shoppingCart === null || shoppingCart === undefined) {
        commit('createCart', payload)
      } else {
        commit('addItemToShoppingCart', payload)
      }
    },
    setShoppinCart({ commit }) {
      var shoppingCart = JSON.parse(sessionStorage.getItem('ShoppingCart'))
      if (shoppingCart != null) {
        commit('SetShoppingCart', shoppingCart)
      }
    },
    removeItemInCart({ commit }, payload) {
      commit('removeItemInCart', payload)
    },
    requestForQoutation({ commit }) {
      commit('requestForQoute')
    }
  },
  getters: {
    getContext(state) {
      return state.context
    },
    getUser(state) {
      return state.user
    },
    getAuthCode(state) {
      return state.user.AuthCode
    },
    getShoppingCart(state) {
      return state.shoppingCart
    },
    getConfirmEmail(state) {
      return state.confirmEmail
    }
  }
})

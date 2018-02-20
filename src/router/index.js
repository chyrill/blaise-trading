import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignUp from '@/components/User/SignUp'
import SignIn from '@/components/User/SignIn'
import Products from '@/components/ProductsManagement/Products'
import ProductListing from '@/components/public/products/Products'
import ShoppingCart from '@/components/public/shoppingcart/shoppingcart'
import Quotation from '@/components/TransactionManagement/Quotation'
import PublicQuotation from '@/components/public/quotations/quotations'
import EmailConfirmation from '@/components/User/EmailConfirmation'
import UserAccounts from '@/components/User/accounts/useraccount'
import LogOut from '@/components/logout'
import MyTransaction from '@/components/public/transactions/transactions'
import DeclinePurchase from '@/components/public/purchaseorder/declinepurchase'
import ConfirmPurchase from '@/components/public/purchaseorder/confirmpurchase'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: {
        forVisitor: true
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {
        forVisitor: true
      }
    },
    {
      path: '/admin/product',
      name: 'Product',
      component: Products,
      meta: {
        forAdmin: true
      }
    },
    {
      path: '/Products',
      name: 'ProductList',
      component: ProductListing
    },
    {
      path: '/ShoppingCart',
      name: 'ShoppingCart',
      component: ShoppingCart
    },
    {
      path: '/admin/quotation',
      name: 'Quotation',
      component: Quotation,
      meta: {
        forAdmin: true
      }
    },
    {
      path: '/quotations',
      name: 'PublicQuotation',
      component: PublicQuotation
    },
    {
      path: '/confirmemail/:id',
      name: 'EmailConfirmation',
      component: EmailConfirmation
    },
    {
      path: '/admin/user',
      name: 'UserAccounts',
      component: UserAccounts,
      meta: {
        forAdmin: true
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      component: LogOut,
      meta: {
        forAdmin: true
      }
    },
    {
      path: '/transactions',
      component: MyTransaction
    },
    {
      path: '/puchase/:id',
      component: ConfirmPurchase
    },
    {
      path: '/decline/:id',
      componenet: DeclinePurchase
    }
  ],
  mode: 'history'
})

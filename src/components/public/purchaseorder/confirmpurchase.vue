<template>
    <v-container fluid>
        <v-card :color="" dark>
            <v-card-title>
                <v-layout row>
                    <v-flex xs8 offset-xs1>
                        <h2>{{Message}}</h2>
                    </v-flex>
                    <v-flex xs2 offset-xs1>
                        <h2><v-icon>{{Actions}}</v-icon></h2>
                    </v-flex> 
                </v-layout>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" to="/"><v-icon left>home</v-icon>Home</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>

export default {
    name: 'confirmPurchase',
    data () {
        return {
            PurchaseOrderNumber: '',
            QuotationItem: {},
            Color: '',
            Message: '',
            Actions: '',
        }    
    },
    mounted () {
        this.getQuotationItem()
    },
    computed: {
    },
    methods: {
        getQuotationItem () {
            axios({
                method: 'get',
                url: 'http://8f466630.ngrok.io/api/v1/quote/' + this.$route.params.id,
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
            .then (response => {
                this.QuotationItem = response.data.model
                this.transformQuotationToPurchase (response.data.model)
            })
            .catch (err => {
                this.Message = err.response.data.message
                this.Actions = 'clear'
                this.Color = 'error'
            })
        },
        transformQuotationToPurchase (quotationItem) {
            let payload = {
                CustomerName: quotationItem.Customer.Name,
                CompanyName: quotationItem.Customer.Others.CompanyName,
                TotalAmount: quotationItem.TotalQuote,
                UserId: quotationItem.Customer.UserId,
                Items: []
            }
    
            for (let item in quotationItem.Items) {
                let data = {
                    Quantity: quotationItem.Items[item].Quantity,
                    TotalAmount: quotationItem.Items[item].TotalAmount,
                    Name: quotationItem.Items[item].Name,
                    UnitPrice: quotationItem.Items[item].UnitPrice,
                    _id: quotationItem.Items[item]._id
                }
                payload.Items.push(data);
            }

            this.createPurchase(payload)
        },
        createPurchase (payload) {
           axios({
                method: 'post',
                url: 'http://5ab1b8cd.ngrok.io/api/v1/purchaseorder',
                data: payload,
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
            .then(response => {
                this.PurchaseOrderNumber = response.data.model._id
                this.updateQuotation()
            })
            .catch(err => {
                this.Message = err.response.data.message
                this.Actions = 'clear'
                this.Color = 'error'
            }) 
        },
        updateQuotation () {
            this.QuotationItem.Status = 'Approved'
            axios({
                method: 'put',
                url: 'http://8f466630.ngrok.io/api/v1/QuotationItem',
                data: this.QuotationItem,
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
                }
            })
            .then(response => {
                this.Message = 'Thank you for Purchasing. Your Purchase Order Number is ' + this.PurchaseOrderNumber
                this.Actions = 'check'
                this.Color = 'success'
            })
            .catch(err => {
                this.Message = err.response.data.message
                this.Actions = 'clear'
                this.Color = 'error'
            })
        }
    }
}
</script>
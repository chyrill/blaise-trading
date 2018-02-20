<template>
	<v-container fluid>
        <v-card dark>
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
		name: 'DeclinePurchase',
		data () {
			return {
				QuotationItem: {},
				Message: '',
				Actions: ''
			}
		},
		mounted () {
			this.getQuotationItem()
		},
		computed: {

		},
		methods: {
			getQuotationItem () {
				var id = this.$router.params.id

				axios({
					method: 'get',
					url: 'http://8f466630.ngrok.io/api/v1/quotation/' + id,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.QuotationItem = response.data.model
					this.updateQuotationItem()
				})
				.catch(err => {
					this.Message = err.response.data.message
					this.Actions = 'clear'
				})
			},
			updateQuotationItem () {
				axios({
					method: 'put',
					url: 'http://8f466630.ngrok.io/api/v1/quotation',
					data: this.QuotationItem,
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.Message = 'Sorry to hear you decline our offer. Hope to have another business with you.'
					this.Actions = 'check'
				})
				.catch(err => {
					this.Message = err.response.data.message
					this.Actions = 'clear'
				})
			}
		}
	}
</script>
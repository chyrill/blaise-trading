<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap>
			<!-- Purchase Order Table -->
			<v-flex xs10 offset-xs1>
				<v-card>
					<v-toolbar  color="primary" dark>
						<v-toolbar-title>My Purchase Orders</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-data-table v-bind:headers="PurchaseOrderHeaders" :items="PurchaseOrderList" hide-actions class="elevation-1">
							<template slot="items" slot-scope="props">
								<td>{{props.item.PurchaseOrderNo}}</td>
								<td>{{props.item.TotalAmount}}</td>
								<td>{{props.item.Status}}</td>
								<td>{{props.item.DateCreated}}</td>
								<td><v-btn flat icon><v-icon>visibility</v-icon></v-btn></td>
							</template>
						</v-data-table> 
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- End of Purchase Order Table -->
		</v-layout>
	</v-container>
</template>


<script>
	import axios from 'axios'
	export default {
		name: 'MyTransactions',
		data () {
			return {
				PurchaseOrderHeaders: [
					{
						text: 'Purchase Order Number',
						align: 'center',
						value: 'PurchaseOrderNo'
					},
					{
						text: 'Amount',
						align: 'center',
						value: 'TotalAmount'
					},
					{
						text: 'Status',
						align: 'center',
						value: 'Status'
					},
					{
						text: 'Date Purchased',
						align: 'DateCreated',
						value: 'DateCreated'
					},
					{
						text: ''
					}
				],
				PurchaseOrderList: []
			}
		},
		methods: {
			getPuchaserOrderList () {
				var user = this.$store.getters.getUser

				axios({
					method: 'get',
					url: 'http://5ab1b8cd.ngrok.io/api/v1/purchaseorder',
					params: {
						Filters: 'UserId:/' + user.UserId + '/',
						sort: '-DateCreated'
					},
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('AuthCode')
					}
				})
				.then(response => {
					this.PurchaseOrderList = response.data.items
				})
				.catch(err => {
					
				})
			}
		},
		computed: {

		},
		mounted () {
			this.getPuchaserOrderList()
		}
	}
</script>
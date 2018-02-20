<template>
</template>

<script>
    import axios from 'axios';
    import { userUrl } from '../../helpers/apiurl'

    export default {
        name: 'EmailConfirmation',
        data () {
            return
            {
              value: ''
            }
        },
        mounted () {
            axios.post('http://d4cebfbf.ngrok.io/api/v1/UserLogin/'+ this.$route.params.id)
                .then(response => {
                    localStorage.setItem('Token', response.data.model)
                    this.$store.dispatch('jwtdecode', response.data.model)
                    this.$router.go
                    this.$router.push('/')
            })
                .catch(err => {
                this.$router.push('/')
            })
        }
    }
</script>

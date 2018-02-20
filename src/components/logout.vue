<template>
</template>

<script>
    export default {
        mounted () {
          this.$store.dispatch('logout')
          localStorage.removeItem('Token')
          localStorage.removeItem('AuthCode')
          localStorage.removeItem('forAdmin')
          this.$router.push('/')
        }
    }
</script>
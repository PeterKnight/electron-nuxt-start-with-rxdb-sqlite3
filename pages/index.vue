<template>
    <div>
        <h1>Welcome!</h1>
        <nuxt-link to="/about">About page</nuxt-link>
    </div>
</template>

<script>


    export default {
        asyncData ( { req } ) {
            return {
                name: req ? 'server' : 'client'
            }
        },
        created() {

        },
        mounted() {

        }
    }

</script>
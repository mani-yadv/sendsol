<template>
    <div class="fixed z-10 my-5 w-screen">
        <div class="flex flex-col space-y-4 pl-10" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useSupabaseClient } from "#imports";

    export default defineComponent({
        name: "HeaderDefault",

        data() {
            return {
                user: {},
                state: {
                    authenticated: false,
                    loading: true
                }
            };
        },
        mounted() {
            // this.initAuth();
        },

        methods: {
            async initAuth() {
                const supabase = useSupabaseClient();
                const { data } = await supabase.auth.getUser();
                if (data.user) {
                    this.user = data.user || {};
                    this.state.authenticated = true;
                }
                this.state.loading = false;

                // Check if the URL contains the "code" parameter
                if (this.$route.query.code) {
                    // TODO: Implement refresh access token using code
                    // https://supabase.com/docs/guides/auth/social-login/auth-google#using-the-oauth-flow-for-web
                }
            }
        }
    });
</script>

<style scoped></style>

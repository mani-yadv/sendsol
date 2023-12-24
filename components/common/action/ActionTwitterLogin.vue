<template>
    <BottomDrawer :can-close="false">
        <template #header>
            <div class="flex items-center space-x-2">
                <PhosphorIconArrowRight class="text-primary" size="24" />
                <div class="text-lg font-bold">Login to create a project</div>
            </div>
        </template>
        <template #content>
            <TwitterLoginButton class="mx-6 mb-2" @click="loginWithTwitter" />
        </template>
    </BottomDrawer>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useUserStore } from "~/stores/user/userStore";

    export default defineComponent({
        name: "ActionTwitterLogin",
        setup() {
            return {
                userStore: useUserStore()
            };
        },
        methods: {
            loginWithTwitter() {
                this.userStore.loginWithTwitter();
            }
        }
    });
</script>

<style scoped></style>

<template>
    <div class="flex">
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="flex h-8 w-8 items-center">
                <UserAvatar :user="userStore.formattedData" role="button" />
            </div>

            <ul class="menu dropdown-content rounded-box z-[1] bg-base-100 p-2 shadow">
                <li>
                    <a @click.prevent="handleLogout">Logout</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useUserStore } from "~/stores/user/userStore";

    export default defineComponent({
        name: "UserMenu",
        setup() {
            return {
                userStore: useUserStore()
            };
        },
        methods: {
            handleLogout() {
                console.log(1231);
                this.userStore.logout().then(() => {
                    this.$router.replace("/");
                });
            }
        }
    });
</script>

<style scoped></style>

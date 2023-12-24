<template>
    <div class="flex">
        <div class="dropdown-end dropdown">
            <div tabindex="0" role="button" class="flex h-8 w-8 items-center">
                <UserAvatar :user="userStore.formattedData" role="button" />
            </div>

            <ul
                tabindex="0"
                class="menu dropdown-content rounded-box z-[1] my-1 border border-neutral bg-base-200 p-0 shadow">
                <li>
                    <div class="px-8 text-xs" @click="handleLogout">Logout</div>
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
                this.userStore.logout().then(() => {
                    location.reload();
                });
            }
        }
    });
</script>

<style scoped></style>

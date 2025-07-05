<template>
    <div class="flex">
        <details class="dropdown dropdown-end">
            <summary role="button" class="flex size-8 items-center">
                <UserAvatar :user="userStore.formattedData" role="button" />
            </summary>

            <ul class="menu dropdown-content z-[1] my-1 rounded-box border border-neutral bg-base-200 p-0 shadow">
                <li>
                    <div class="px-8 text-xs" @click="handleLogout">Logout</div>
                </li>
            </ul>
        </details>
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

<template>
    <div>
        <div class="flex-col">
            <div class="max-w-screen flex items-center justify-between">
                <LogoMain />

                <div class="flex items-center space-x-4">
                    <ProjectsCreateAction v-if="!isProjectCreatePage" />
                    <UserMenu v-if="userStore.authenticated" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useUserStore } from "~/stores/user/userStore";
    import UserMenu from "~/components/common/user/UserMenu.vue";

    export default defineComponent({
        name: "HeaderDefault",
        components: { UserMenu },

        setup() {
            return {
                userStore: useUserStore()
            };
        },

        computed: {
            isProjectCreatePage() {
                return this.$route.path.includes("/projects/create");
            }
        }
    });
</script>

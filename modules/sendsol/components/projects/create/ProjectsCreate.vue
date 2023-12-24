<template>
    <div>
        <div class="flex flex-col space-y-10 text-primary-content">
            <div class="flex items-center justify-between rounded-lg bg-primary px-4 py-2">
                <h3 class="text-sm font-bold text-primary-content">Crowdfund Solana Projects</h3>
                <div class="flex items-center">
                    <SVGSolanaOutline height="18" />
                    <SVGUsdcOutline height="20" />
                    <PhosphorIconCoins size="28" class="ml-1" />
                </div>
            </div>
        </div>

        <div class="my-10 mb-40">
            <ProjectsCreateForm />
        </div>

        <ActionTwitterLogin v-if="!userStore.authenticated" class="mb-2" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useUserStore } from "~/stores/user/userStore";

    export default defineComponent({
        name: "ProjectsCreate",
        setup() {
            return {
                userStore: useUserStore()
            };
        }
    });
</script>

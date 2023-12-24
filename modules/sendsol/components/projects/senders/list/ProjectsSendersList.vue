<template>
    <div class="flex flex-col space-y-4">
        <div class="mx-2 flex justify-between">
            <h3 class="text-2xl font-bold">All Senders</h3>
            <h3 class="text-2xl font-bold">1500</h3>
        </div>

        <div class="stats stats-vertical w-full border border-neutral shadow">
            <div v-for="item in Array(20)" :key="item" class="stat">
                <div class="stat-figure flex items-center space-x-2">
                    <SVGSolanaOutline class="text-primary" width="14" />
                    <div class="stat-value text-base text-primary">0.15</div>
                </div>
                <div class="stat-title text-sm">CDC....TyXGA {{ item }}</div>
                <div class="stat-desc flex items-center space-x-1">
                    <PhosphorIconCoins size="12" />
                    <span>945K</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsSendersList"
    });
</script>

<style scoped></style>

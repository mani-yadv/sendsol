<template>
    <div class="my-12 w-full flex-col space-y-4">
        <div class="w-36">
            <div role="tablist" class="tabs-boxed tabs">
                <a role="tab" class="tab tab-active tab-sm">Active</a>
                <a role="tab" class="tab tab-sm">Ended</a>
            </div>
        </div>

        <div class="stats stats-vertical w-full border border-neutral shadow">
            <div v-for="item in Array(20)" :key="item" class="stat">
                <div class="stat-figure">
                    <div class="flex items-center space-x-2">
                        <SVGSolanaOutline class="text-primary" width="14" />
                        <div class="stat-value text-base text-primary">225</div>
                    </div>
                    <div class="stat-desc flex items-center justify-end space-x-1">
                        <PhosphorIconUsers size="12" />
                        <span>200</span>
                    </div>
                </div>
                <NuxtLink to="1">
                    <div class="stat-title text-sm font-bold underline">Dog Wif Hat</div>
                </NuxtLink>
                <div class="stat-desc mt-1 flex items-center space-x-1.5">
                    <PhosphorIconCoins size="12" />
                    <span>200M</span>

                    <!--Link opens separately-->
                    <span class="text-secondary">WIF</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    export default {
        name: "ProjectsList"
    };
</script>

<template>
    <div>
        <div class="stat-figure">
            <div class="flex items-center space-x-2">
                <SVGSolanaOutline class="text-primary" width="14" />
                <div class="stat-value text-base text-primary">0</div>
            </div>
            <div class="stat-desc flex items-center justify-end space-x-1">
                <PhosphorIconUsers size="12" />
                <span>0</span>
            </div>
        </div>
        <NuxtLink :to="`/${project.handle}`">
            <div class="stat-title text-sm font-bold underline">
                {{ project.name }}
            </div>
        </NuxtLink>
        <div v-if="project.is_coin_project" class="stat-desc mt-1 flex items-center space-x-1.5">
            <PhosphorIconCoins size="12" />
            <span>
                {{ totalAllocatedQuantity }}
            </span>

            <!--Link opens separately-->
            <span v-if="project.coin_ticker" class="text-secondary">
                {{ project.coin_ticker }}
            </span>
        </div>
    </div>
</template>
<script lang="ts">
    import NumberHelper from "~/helpers/NumberHelper";

    export default {
        name: "ProjectsListItem",
        props: {
            project: {
                type: Object,
                required: true
            }
        },

        computed: {
            totalAllocatedQuantity() {
                return NumberHelper.formatKMB(this.project.total_allocated_quantity);
            }
        }
    };
</script>

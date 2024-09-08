<template>
    <div class="stats stats-vertical w-full border border-neutral shadow">
        <div class="stat">
            <div class="stat-figure mb-2">
                <SVGSolanaOutline class="text-secondary" width="28" />
            </div>
            <div class="stat-title">Total sent</div>
            <div class="stat-value text-primary">0</div>
            <div class="stat-desc flex items-center space-x-1">
                <SVGUsdcOutline width="12" />
                <span>0</span>
            </div>
        </div>
        <div class="stat">
            <div class="stat-figure text-secondary">
                <SVGBolt />
            </div>
            <div class="stat-title">Total senders</div>
            <div class="stat-value text-secondary">0</div>
            <div class="stat-desc">Ends in 3 weeks</div>
        </div>

        <!-- For future -->
        <div v-if="false" class="stat">
            <div class="stat-figure text-secondary">
                <SVGBolt />
            </div>
            <div class="stat-title">Page Views</div>
            <div class="stat-value text-secondary">2.6M</div>
            <div class="stat-desc">21% more than last month</div>
        </div>
        <div v-if="project.is_coin_project" class="stat">
            <div class="stat-figure text-secondary">
                <PhosphorIconCoins size="28" />
            </div>
            <div class="stat-value">{{ totalAllocatedQuantity }}</div>
            <div class="stat-desc">Allocated to senders</div>
            <div class="stat-desc text-secondary">${{ project.coin_ticker }}</div>
        </div>

        <div class="stat">
            <div class="stat-figure text-secondary">
                <div class="avatar online">
                    <div class="w-16 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
            </div>
            <div class="stat-value">3.33k</div>
            <div class="stat-desc">Followers</div>
            <div class="stat-desc text-secondary">Under review</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import NumberHelper from "~/helpers/NumberHelper";

    export default defineComponent({
        name: "ProjectsDetailsStats",
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
    });
</script>

<style scoped></style>

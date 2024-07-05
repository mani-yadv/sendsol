<template>
    <div class="stats stats-vertical w-full border border-neutral shadow">
        <div class="stat">
            <div class="stat-figure mb-2">
                <SVGSolanaOutline class="text-secondary" width="28" />
            </div>
            <div class="stat-title">Total sent</div>
            <div class="stat-value text-primary">25</div>
            <div class="stat-desc flex items-center space-x-1">
                <SVGUsdcOutline width="12" />
                <span>2500</span>
            </div>
        </div>
        <div class="stat">
            <div class="stat-figure text-secondary">
                <SVGBolt />
            </div>
            <div class="stat-title">Total senders</div>
            <div class="stat-value text-secondary">1500</div>
            <div class="stat-desc">21k page views</div>
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
        <div class="stat">
            <div class="stat-figure text-secondary">
                <PhosphorIconCoins size="28" />
            </div>
            <div class="stat-value">250M</div>
            <div class="stat-desc">Allocated to senders</div>
            <div class="stat-desc text-secondary">$SEND</div>
        </div>

        <div class="stat">
            <div class="stat-figure text-secondary">
                <div class="avatar online">
                    <div class="w-16 rounded-full">
                        <img src="https://pbs.twimg.com/profile_images/1588506605548716033/DsJJFGDX_400x400.jpg" />
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

    export default defineComponent({
        name: "ProjectsDetailsStats"
    });
</script>

<style scoped></style>

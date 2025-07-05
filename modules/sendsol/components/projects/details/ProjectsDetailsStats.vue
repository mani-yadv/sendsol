<template>
    <div class="stats stats-vertical w-full border border-neutral shadow">
        <div class="stat">
            <div class="stat-figure mb-2">
                <SVGSolanaOutline class="text-secondary" width="28" />
            </div>
            <div class="stat-title">Total sent</div>
            <div class="stat-value text-primary">{{ numberHelper.formatSol(project.total_raised) }}</div>
            <div v-if="usdcAmount" class="stat-desc flex items-center space-x-1">
                <SVGUsdcOutline width="12" />
                <span>${{ usdcAmount }}</span>
            </div>
        </div>
        <div class="stat">
            <div class="stat-figure text-secondary">
                <SVGBolt />
            </div>
            <div class="stat-title">Total senders</div>
            <div class="stat-value text-secondary">{{ project.total_senders || 0 }}</div>
            <div class="stat-desc">{{ projectTimeLeft }}</div>
        </div>

        <div class="stat">
            <div class="stat-figure text-secondary">
                <PhosphorIconTarget size="28" />
            </div>
            <div class="stat-title">Goal</div>
            <div class="stat-value text-secondary">{{ goalDisplay }}</div>
            <div v-if="shouldShowEndDate" class="stat-desc flex items-center space-x-1">
                <PhosphorIconCalendar size="12" />
                <div>{{ endDateDisplay }}</div>
            </div>
        </div>

        <div class="stat">
            <div class="stat-figure text-secondary">
                <div class="avatar online">
                    <div
                        v-if="!project.avatar_url"
                        class="flex w-16 items-center justify-center rounded-full bg-base-200">
                        <PhosphorIconUser size="32" weight="bold" />
                    </div>
                    <div v-else class="w-16 rounded-full">
                        <img :src="project.avatar_url" />
                    </div>
                </div>
            </div>
            <div class="stat-desc">Creator</div>
            <div
                v-if="project.username"
                class="stat-value cursor-pointer text-[18px] hover:text-primary"
                @click="handleOpenXProfile">
                @{{ project.username }}
            </div>
            <div class="stat-desc" :class="reviewStatusColor">{{ reviewStatusDisplay }}</div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import NumberHelper from "~/helpers/NumberHelper";
    import DateHelper from "~/helpers/DateHelper";
    import { PROJECT_REVIEW_STATUS_DISPLAY, PROJECT_REVIEW_STATUS_COLOR } from "@/constants/projectReviewStatus";

    export default defineComponent({
        name: "ProjectsDetailsStats",
        props: {
            project: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                numberHelper: NumberHelper,
                usdcAmount: ""
            };
        },
        computed: {
            projectTimeLeft() {
                if (!this.project.end_date) return "";
                return `Ends ${DateHelper.formatTimeAgo(this.project.end_date)}`;
            },
            goalDisplay() {
                return this.project.goal_amount ? this.numberHelper.formatSol(this.project.goal_amount) : "∞";
            },
            endDateDisplay() {
                if (!this.project.end_date) return "";
                return `Ends on ${DateHelper.formatToLocalDate(this.project.end_date)}`;
            },
            shouldShowEndDate() {
                if (!this.project.end_date) return false;

                const endDate = new Date(this.project.end_date);
                const oneMonthFromNow = new Date();
                oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

                return endDate <= oneMonthFromNow;
            },
            reviewStatusDisplay() {
                return PROJECT_REVIEW_STATUS_DISPLAY[this.project.review_status] || "Under Review";
            },
            reviewStatusColor() {
                return PROJECT_REVIEW_STATUS_COLOR[this.project.review_status] || "text-info";
            }
        },
        watch: {
            "project.total_raised": {
                immediate: true,
                async handler(newAmount) {
                    if (!newAmount) {
                        this.usdcAmount = "";
                        return;
                    }
                    try {
                        const response = await fetch(
                            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
                        );
                        const data = await response.json();
                        const solPrice = data.solana.usd;
                        const solAmount = newAmount / 1e9; // Convert lamports to SOL
                        this.usdcAmount = (solAmount * solPrice).toFixed(4);
                    } catch (error) {
                        this.usdcAmount = "";
                    }
                }
            }
        },
        methods: {
            handleOpenXProfile() {
                if (this.project.x_profile_url) {
                    window.open(this.project.x_profile_url, "_blank");
                }
            }
        }
    });
</script>

<style scoped></style>

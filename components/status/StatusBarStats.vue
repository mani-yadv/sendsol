<template>
    <div class="flex w-full border-b border-neutral/75 py-0.5">
        <div 
            class="border-r border-neutral/75 px-2 text-2xs text-base-content/50 cursor-pointer hover:text-base-content/75"
            @click="showRoadmap = true">
            Roadmap
        </div>
        <div class="border-r border-neutral/75 px-2 text-2xs text-base-content/50">
            Total SOL sent: {{ formatSolAmount(totalSol) }}
        </div>
        
        <!-- Roadmap Bottom Drawer -->
        <BottomDrawer v-if="showRoadmap" @close="showRoadmap = false">
            <template #header>
                <h3 class="font-bold text-lg">SendSol Roadmap 2025</h3>
            </template>
            
            <template #content>
                <div class="h-[70vh] overflow-y-auto -ml-20">
                    <!-- Timeline using DaisyUI -->
                    <ul class="timeline timeline-vertical pr-8">
                        <li v-for="(item, index) in roadmapItems" :key="index">
                            <div class="timeline-start text-xs">{{ item.date }}</div>
                            <div class="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" :class="item.completed ? 'text-primary' : 'text-base-content/50'">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.29 10.722a.75.75 0 00-1.08 1.04l1.75 1.815a.75.75 0 001.146-.102l3.75-5.25z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="timeline-end timeline-box" :class="item.completed ? 'bg-primary/10' : ''">
                                <div class="font-bold text-sm">{{ item.title }}</div>
                                <div class="text-xs opacity-70 mt-1">{{ item.description }}</div>
                            </div>
                            <hr v-if="index < roadmapItems.length - 1" />
                        </li>
                    </ul>
                </div>
            </template>
        </BottomDrawer>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useTransactionsStore } from "~/stores/transactions/transactionsStore";
    import NumberHelper from "~/helpers/NumberHelper";

    export default defineComponent({
        name: "StatusBarStats",
        data() {
            return {
                showRoadmap: false,
                totalSol: 0,
                roadmapItems: [
                    {
                        date: "July 2025",
                        title: "Platform Launch",
                        description: "SendSol crowdfunding platform goes live",
                        completed: true
                    },
                    {
                        date: "End July 2025",
                        title: "SOLMate Wallet Fundraising",
                        description: "Start raising funds for SOLMate Wallet development",
                        completed: false
                    },
                    {
                        date: "1st Week Aug 2025",
                        title: "SENDSOL Token Launch",
                        description: "Launch native utility token during Solana Mobile Hackathon '25",
                        completed: false
                    },
                    {
                        date: "Aug 2025",
                        title: "SOLMate Wallet Development",
                        description: "Begin building next-generation Solana mobile wallet",
                        completed: false
                    },
                    {
                        date: "Mid Aug 2025",
                        title: "Community Onboarding",
                        description: "Onboard community projects and expand platform",
                        completed: false
                    },
                    {
                        date: "Sep 2025",
                        title: "Creator Profiles & Tipping",
                        description: "Launch creator profile pages and tip creators feature",
                        completed: false
                    },
                    {
                        date: "Nov 2025",
                        title: "Escrow Support",
                        description: "Implement escrow functionality for secure transactions",
                        completed: false
                    },
                    {
                        date: "Dec 2025",
                        title: "SOLMate Wallet Launch",
                        description: "Release SOLMate mobile wallet to the public",
                        completed: false
                    }
                ]
            };
        },
        async mounted() {
            await this.fetchTotalSol();
        },
        methods: {
            async fetchTotalSol() {
                try {
                    const transactionsStore = useTransactionsStore();
                    const { data, error } = await transactionsStore.getTotalSolSent();
                    
                    if (error) {
                        console.error("Failed to fetch total SOL:", error);
                        return;
                    }
                    
                    this.totalSol = data.total_sol;
                } catch (error) {
                    console.error("Error fetching total SOL:", error);
                }
            },
            formatSolAmount(amount) {
                if (amount >= 1000000) {
                    return (amount / 1000000).toFixed(1) + "M";
                } else if (amount >= 1000) {
                    return (amount / 1000).toFixed(1) + "K";
                } else {
                    return NumberHelper.format(amount, 2);
                }
            }
        }
    });
</script>

<style scoped></style>

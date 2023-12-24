<template>
    <div>
        <div class="rounded-2xl border border-neutral bg-neutral">
            <div class="stats w-full bg-primary">
                <div class="stat text-primary-content">
                    <div class="stat-title font-bold text-primary-content">You sent</div>
                    <div class="stat-value flex items-center space-x-2">
                        <SVGSolanaOutline width="28" />
                        <span>0.05</span>
                    </div>
                </div>

                <div class="stat flex flex-col justify-end text-primary-content">
                    <div class="stat-title text-right font-bold text-primary-content">Allocation</div>
                    <div class="stat-value text-right">250K</div>
                </div>
            </div>

            <div class="m-3 flex justify-center" @click="state.actionSend = true">
                <div class="text-xl font-bold text-primary">Send SOL</div>
            </div>
        </div>

        <ProjectsSendersUserActionSend v-if="state.actionSend" @close="state.actionSend = false" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsSendersUserStat",
        data() {
            return {
                state: {
                    actionSend: false
                }
            };
        }
    });
</script>

<style scoped></style>

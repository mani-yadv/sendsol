<template>
    <!-- Input Number -->
    <div class="rounded-lg border border-neutral">
        <div class="flex w-full items-center justify-between gap-x-1">
            <div class="grow px-3 py-2">
                <input
                    v-model="value"
                    class="w-full border-0 bg-transparent p-0 text-lg font-bold text-gray-800 focus:outline-0 focus:ring-0 dark:text-white"
                    type="number" />
            </div>
            <div
                class="-gap-y-px flex items-center divide-x divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    @click="handleDecrement">
                    <PhosphorIconMinus />
                </button>
                <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    @click="handleIncrement">
                    <PhosphorIconPlus />
                </button>
            </div>
        </div>
    </div>
    <!-- End Input Number -->
</template>
<script lang="ts">
    export default {
        name: "NumberInput",
        props: {
            steps: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                value: 0
            };
        },

        methods: {
            handleIncrement() {
                this.value += this.steps;
            },

            handleDecrement() {
                if (this.value - this.steps > 0) {
                    this.value -= this.steps;
                } else {
                    this.value = 0;
                }
            }
        }
    };
</script>

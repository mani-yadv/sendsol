<template>
    <!-- Input Number -->
    <div class="rounded-lg border border-neutral">
        <div class="flex w-full items-center justify-between gap-x-1">
            <div class="grow px-3 py-2">
                <input
                    :value="modelValue"
                    :min="min"
                    :max="max"
                    :step="steps"
                    class="w-full border-0 bg-transparent p-0 text-lg font-bold text-gray-800 focus:outline-0 focus:ring-0 dark:text-white"
                    type="number"
                    @input="handleInput" />
            </div>
            <div
                class="-gap-y-px flex items-center divide-x divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                <button
                    type="button"
                    class="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    :disabled="modelValue <= min"
                    @click="handleDecrement">
                    <PhosphorIconMinus />
                </button>
                <button
                    type="button"
                    class="inline-flex size-10 items-center justify-center gap-x-2 bg-white text-sm font-medium text-gray-800 last:rounded-e-lg hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    :disabled="modelValue >= max"
                    @click="handleIncrement">
                    <PhosphorIconPlus />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NumberInput",
        props: {
            modelValue: {
                type: Number,
                default: 0
            },
            steps: {
                type: Number,
                default: 0.1
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: Number.MAX_VALUE
            }
        },

        methods: {
            handleInput(event) {
                const value = event.target.value;
                const parsed = parseFloat(value);

                if (!isNaN(parsed)) {
                    const clamped = Math.max(this.min, Math.min(this.max, parsed));
                    this.$emit("update:modelValue", parseFloat(clamped.toFixed(4)));
                }
            },

            handleIncrement() {
                const newValue = Math.min(this.max, this.modelValue + this.steps);
                this.$emit("update:modelValue", parseFloat(newValue.toFixed(4)));
            },

            handleDecrement() {
                const newValue = Math.max(this.min, this.modelValue - this.steps);
                this.$emit("update:modelValue", parseFloat(newValue.toFixed(4)));
            }
        }
    };
</script>

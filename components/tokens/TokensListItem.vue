<template>
    <div>
        <div class="flex items-start space-x-2" @click="handleSelected">
            <div v-if="token.logoURI" class="rounded-full">
                <img :src="token.logoURI" class="h-4 w-4" alt="token img" />
            </div>
            <div class="text-2xs">
                {{ token.symbol }}
            </div>
        </div>
        <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center justify-between space-x-0.5 text-success">
                <span class="text-2xs">2%</span>
                <PhosphorIconArrowUp class="inline-block h-2 w-2" />
            </div>
            <div v-if="token.activityRating" class="flex items-center justify-between space-x-0.5">
                <span class="text-2xs">{{ token.activityRating }}</span>
                <PhosphorIconUsers class="inline-block h-4 w-3" />
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "TokensListItem",
        props: {
            token: {
                type: Object,
                required: true
            }
        },
        emits: ["selected:token"],

        methods: {
            handleSelected() {
                this.$emit("selected:token", this.token);
            }
        }
    };
</script>

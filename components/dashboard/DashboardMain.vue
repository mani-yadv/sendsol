<template>
    <div class="w-full">
        <div class="fixed inset-x-2 z-10 h-1/2">
            <div v-if="selected" class="flex h-full flex-col justify-between space-y-2">
                <div class="flex items-center space-x-2">
                    <div v-if="selected.logoURI" class="rounded-full">
                        <!-- eslint-disable-next-line prettier/prettier -->
                        <img :src="selected.logoURI" class="h-8 w-8" alt="token img">
                    </div>
                    <div class="text-base">
                        {{ selected.symbol }}
                        <span v-if="selected.activityRating" class="text-2xs">({{ selected.activityRating }})</span>
                    </div>
                </div>
                <div class="bottom-0 grid grid-cols-4 gap-2">
                    <div class="border-2 border-white">Take profit 1</div>
                    <div class="border-2 border-white">Take profit 2</div>
                    <div class="border-2 border-white">Take profit 3</div>
                    <div class="border-2 border-white">Take profit 4</div>
                </div>
            </div>
            <div v-else>Please select a token</div>
        </div>
        <TokensList @selected:token="handleSelectedToken"></TokensList>
    </div>
</template>

<script>
    export default {
        name: "DashboardMain",
        data() {
            return {
                selected: null
            };
        },

        methods: {
            handleSelectedToken(token) {
                this.selected = token;
            }
        }
    };
</script>

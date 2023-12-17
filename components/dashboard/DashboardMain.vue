<template>
    <div class="w-full">
        <div class="fixed inset-x-2 z-10 h-1/3">
            <TokensSelected />
        </div>
        <div class="fixed inset-x-2 -bottom-16 h-2/3 overflow-y-auto">
            <div class="z-20 my-1 h-10 w-full">
                <TokensFilters />
            </div>
            <div>
                <TokensList />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DashboardMain"
    };
</script>

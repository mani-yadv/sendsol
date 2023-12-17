<template>
    <div class="w-full">
        <div class="fixed inset-x-2 z-10 h-1/2">
            <TokensSelected />
        </div>
        <div class="fixed inset-x-2 -bottom-16 h-1/2 overflow-y-auto">
            <TokensList />
        </div>
    </div>
</template>

<script>
    export default {
        name: "DashboardMain"
    };
</script>

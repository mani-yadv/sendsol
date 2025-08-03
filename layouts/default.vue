<template>
    <div>
        <StatusBarStats />
        <div class="m-6 flex flex-col space-y-10">
            <HeaderDefault />
            <slot />
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    
    export default defineComponent({
        name: "default"
    });
</script>

<style scoped></style>

<template>
    <div>
        <div class="m-6 flex flex-col space-y-10">
            <HeaderDefault />
            <slot />
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from "vue";
    export default defineComponent({
        name: "ProjectsDefault"
    });
</script>

<style scoped></style>

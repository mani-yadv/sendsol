<template>
    <div class="flex flex-col space-y-10">
        <ProjectsSendersUserStat />
        <ProjectsSendersList />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsSenders"
    });
</script>

<style scoped></style>

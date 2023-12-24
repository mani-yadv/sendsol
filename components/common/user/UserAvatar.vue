<template>
    <div class="avatar online">
        <div class="rounded-full">
            <img :src="user.avatar" :alt="user.name" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "UserAvatar",
        props: {
            user: {
                type: Object,
                required: true
            }
        }
    });
</script>

<style scoped></style>

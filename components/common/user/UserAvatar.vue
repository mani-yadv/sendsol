<template>
    <div :class="['avatar', showOnlineStatus && 'online']" @click="handleClick">
        <div class="cursor-pointer rounded-full">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name || 'User'" />
            <div v-else class="flex size-full items-center justify-center rounded-full border border-primary">
                <PhosphorIconUser class="size-1/2" />
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "UserAvatar",
        props: {
            user: {
                type: Object,
                required: true
            },
            showOnlineStatus: {
                type: Boolean,
                default: false
            },
            externalProfileLink: {
                type: String,
                default: ""
            }
        },
        methods: {
            handleClick() {
                if (this.externalProfileLink) {
                    window.open(this.externalProfileLink, "_blank");
                }
            }
        }
    });
</script>

<style scoped></style>

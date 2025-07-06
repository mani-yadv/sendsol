<template>
    <div>
        <div class="fixed left-0 top-0 flex h-full w-screen flex-col justify-end overflow-y-hidden bg-base-300/75 z-50">
            <!--Bottom drawer-->
            <div
                ref="drawer"
                v-auto-animate
                class="duration-1500 w-full translate-y-full bg-base-100 p-6 shadow-2xl transition-transform ease-in-out">
                <!-- Close icon -->
                <div class="mx-auto max-w-md">
                    <div class="flex justify-between">
                        <slot name="header" />

                        <button v-if="canClose" class="btn btn-circle btn-sm" @click="handleClose">
                            <PhosphorIconX size="16" />
                        </button>
                    </div>

                    <!-- Drawer content goes here -->
                    <div class="mt-14 pb-2">
                        <slot name="content" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { vAutoAnimate } from "@formkit/auto-animate/vue";

    export default {
        name: "BottomDrawer",
        directives: {
            autoAnimate: vAutoAnimate
        },
        props: {
            canClose: {
                type: Boolean,
                default: true
            }
        },
        emits: ["close"],
        data() {
            return {
                drawer: null as HTMLDivElement | null
            };
        },
        mounted() {
            this.drawer = this.$refs.drawer as HTMLDivElement;
            if (this.drawer) {
                this.drawer.style.transform = "translateY(0)";
            }
        },
        methods: {
            handleClose() {
                if (this.drawer) {
                    this.drawer.style.transform = "translateY(100%)";
                    this.$emit("close");
                }
            }
        }
    };
</script>

<style scoped></style>

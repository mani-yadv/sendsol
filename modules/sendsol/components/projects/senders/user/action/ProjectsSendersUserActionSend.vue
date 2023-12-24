<template>
    <div>
        <BottomDrawer @close="handleClose">
            <template #header>
                <div class="text-xl font-bold">Send SOL to this project</div>
            </template>
            <template #content>
                <div class="mt-4 flex h-full flex-col justify-end space-y-12">
                    <div>
                        <NumberInput />
                        <div class="flex w-full items-center justify-between rounded-lg px-1 pt-2.5 text-2xs">
                            <div class="flex space-x-2 font-bold">
                                <span class="badge badge-xs text-2xs">SOL Balance: 12.5</span>
                            </div>
                            <div class="flex space-x-1">
                                <span class="badge badge-xs text-2xs">1%</span>
                                <span class="badge badge-xs text-2xs">3%</span>
                                <span class="badge badge-xs text-2xs">5%</span>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary">Send</button>
                </div>
            </template>
        </BottomDrawer>
    </div>
</template>
<script lang="ts">
    import { vAutoAnimate } from "@formkit/auto-animate/vue";

    export default {
        name: "ProjectsSendersUserActionSend",
        directives: {
            autoAnimate: vAutoAnimate
        },
        emits: ["close"],
        methods: {
            handleClose() {
                this.$emit("close");
            }
        }
    };
</script>

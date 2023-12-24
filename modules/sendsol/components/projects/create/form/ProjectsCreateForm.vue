<template>
    <div>
        <!-- Form -->
        <div class="z-10 flex w-full flex-col space-y-10">
            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Name your project</span>
                </span>
                <input type="text" placeholder="Dog wif hat" class="input input-bordered" />
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Choose project page url</span>
                </span>
                <input type="text" placeholder="dog-wif-hat" class="input input-bordered" />
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Coins allocation</span>
                </span>
                <select class="select select-bordered">
                    <option disabled selected>Are you allocating coins to senders?</option>
                    <option>Yes</option>
                    <option>No</option>
                </select>
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Name of the coin allocated</span>
                </span>
                <input type="text" placeholder="wif" class="input input-bordered" />
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Coin allocation type</span>
                </span>
                <select class="select select-bordered">
                    <option disabled selected>Are you allocating coins to senders?</option>
                    <option>Proportionate to SOL Sent</option>
                    <option>Equal Allocation per Sender</option>
                    <option>Allocation Details Not Revealed</option>
                </select>
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Total allocated coins (for all senders)</span>
                </span>
                <input type="number" placeholder="20000000" class="input input-bordered" />
            </label>
            <label v-if="false" class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">Your X username (twitter handle)</span>
                </span>
                <input type="text" placeholder="vernon1943" class="input input-bordered" />
            </label>

            <label class="form-control w-full">
                <span class="label">
                    <span class="label-text font-bold">SOL Transfer Duration</span>
                </span>
                <select class="select select-bordered">
                    <option disabled selected>Select the time period sending SOL</option>
                    <option>1 week</option>
                    <option>2 weeks</option>
                    <option>3 weeks</option>
                    <option>4 weeks</option>
                </select>
            </label>
        </div>

        <div class="z-20">
            <div class="fixed inset-x-0 bottom-0 border border-neutral bg-base-300 p-8 shadow-lg">
                <div class="mx-auto max-w-[420px]">
                    <NuxtLink to="/1">
                        <button class="btn btn-primary btn-outline w-full">Create project</button>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsCreateForm"
    });
</script>

<style scoped></style>

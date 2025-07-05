import { useSupabaseClient } from "#imports";

export function useSupabaseModel(ModelClass) {
    const model = new ModelClass();
    if (process.client) {
        model.setSupabaseClient(useSupabaseClient());
    }
    return model;
}

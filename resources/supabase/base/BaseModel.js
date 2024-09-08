import { useSupabaseClient } from "#imports";

export default class BaseModel {
    constructor() {
        this.supabase = useSupabaseClient();
        this.runtimeConfig = useRuntimeConfig();
    }
}

export default class BaseModel {
    constructor(client) {
        this.supabase = client;
        this.tableName = "";
    }
}

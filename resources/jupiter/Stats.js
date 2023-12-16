import BaseModel from "~/resources/jupiter/base/BaseModel.js";

export default class Stats extends BaseModel {
    resourceUrl() {
        return "https://stats.jup.ag/info/day";
    }

    async get(params = {}) {
        return this.axios.get(this.resourceUrl(), { params });
    }
}

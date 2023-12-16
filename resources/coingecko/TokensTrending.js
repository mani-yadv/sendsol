import BaseModel from "~/resources/coingecko/base/BaseModel.js";

export default class TokensTrending extends BaseModel {
    resourceUrl() {
        return "https://api.coingecko.com/api/v3/search/trending";
    }

    async get(params = {}) {
        return this.axios.get(this.resourceUrl(), { params });
    }
}

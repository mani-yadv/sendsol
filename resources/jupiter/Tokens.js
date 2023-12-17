import BaseModel from "~/resources/jupiter/base/BaseModel.js";

export default class Tokens extends BaseModel {
    resourceUrl() {
        return "https://token.jup.ag/strict";
    }

    get(params = {}) {
        return this.axios.get(this.resourceUrl(), { params });
    }
}

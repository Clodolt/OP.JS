"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonInfo = exports.Season = void 0;
class Season {
    constructor(seasonId, tierInfo, createdAt) {
        this.seasonId = seasonId;
        this.tierInfo = tierInfo;
        this.createdAt = createdAt;
    }
}
exports.Season = Season;
class SeasonInfo {
    constructor(id, value, displayValue, isPreseason) {
        this.id = id;
        this.value = value;
        this.displayValue = displayValue;
        this.isPreseason = isPreseason;
    }
}
exports.SeasonInfo = SeasonInfo;

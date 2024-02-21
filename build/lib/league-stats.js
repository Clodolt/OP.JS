"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueStats = exports.QueueInfo = exports.Tier = void 0;
class Tier {
    constructor(tier, division, lp, tierImageUrl, borderImageUrl) {
        this.tier = tier;
        this.division = division;
        this.lp = lp;
        this.tierImageUrl = tierImageUrl;
        this.borderImageUrl = borderImageUrl;
    }
}
exports.Tier = Tier;
class QueueInfo {
    constructor(id, queueTranslate, gameType) {
        this.id = id;
        this.queueTranslate = queueTranslate;
        this.gameType = gameType;
    }
}
exports.QueueInfo = QueueInfo;
class LeagueStats {
    constructor(queueInfo, tierInfo, win, lose, isHotStreak, isFreshBlood, isVeteran, isInactive, series, updatedAt) {
        this.queueInfo = queueInfo;
        this.tierInfo = tierInfo;
        this.win = win;
        this.lose = lose;
        this.isHotStreak = isHotStreak;
        this.isFreshBlood = isFreshBlood;
        this.isVeteran = isVeteran;
        this.isInactive = isInactive;
        this.series = series;
        this.updatedAt = updatedAt;
    }
}
exports.LeagueStats = LeagueStats;

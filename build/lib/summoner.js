"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Summoner {
    constructor(id, summonerId, acctId, puuid, name, internalName, profileImageUrl, level, updatedAt, renewableAt, previousSeasons, leagueStats, mostChampions, recentGameStats) {
        this.id = id;
        this.summonerId = summonerId;
        this.acctId = acctId;
        this.puuid = puuid;
        this.name = name;
        this.internalName = internalName;
        this.profileImageUrl = profileImageUrl;
        this.level = level;
        this.updatedAt = updatedAt;
        this.renewableAt = renewableAt;
        this.previousSeasons = previousSeasons;
        this.leagueStats = leagueStats;
        this.mostChampions = mostChampions;
        this.recentGameStats = recentGameStats;
    }
}
exports.default = Summoner;

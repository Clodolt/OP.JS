import { ChampionStats } from "./champion";
import { Game } from "./game";
import { LeagueStats } from "./league-stats";
import { Season } from "./season";

class Summoner {
    constructor(
        public id: number,
        public summonerId: string,
        public acctId: string,
        public puuid: string,
        public name: string,
        public internalName: string,
        public profileImageUrl: string,
        public level: number,
        public updatedAt: Date,
        public renewableAt: Date,
        public previousSeasons: Season[] | Season,
        public leagueStats: LeagueStats[] | LeagueStats,
        public mostChampions: ChampionStats[],
        public recentGameStats: Game[] | Game
    ) {}
}

export default Summoner;
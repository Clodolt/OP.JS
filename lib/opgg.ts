import axios from 'axios';
import { By, Region } from './parameterss';
import { Champion, ChampionStats, Passive, Price, Skin, Spell } from './champion';
import { Season, SeasonInfo } from './season';
import Summoner from './summoner';
import { LeagueStats, QueueInfo, Tier } from './league-stats';
import { Game } from './game';
import * as cheerio from 'cheerio';

class OPGG {
    private summonerId: string | null;
    private region: Region;
    private apiUrl: string;
    private headers: Record<string, string>;
    private allChampions: Champion[] | undefined;
    private allSeasons: SeasonInfo[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cachedPageProps: any;

    constructor(summonerId: string | null, region: Region = Region.NA) {
        this.summonerId = summonerId;
        this.region = region;
        this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
        this.headers = { "User-Agent": "Your User Agent String" };
        this.allChampions
        this.allSeasons
        this.cachedPageProps
    }


    private refreshApiUrl(): void {
        this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
    }

    async getSummoner(): Promise<Summoner | null> {
        console.log(`Sending request to OPGG API... (API_URL = ${this.apiUrl}, HEADERS = ${JSON.stringify(this.headers)})`);

        try {
            const response = await axios.get(this.apiUrl, { headers: this.headers });
            const content = response.data.data;

            const previousSeasons: Season[] = content.summoner.previous_seasons.map((season: any) => new Season(
                this.allSeasons.find(s => s.id === season.season_id),
                new Tier(
                    season.tier_info.tier,
                    season.tier_info.division,
                    season.tier_info.lp,
                    season.tier_info.tier_image_url,
                    season.tier_info.border_image_url
                ),
                new Date(season.created_at)
            ));

            const leagueStats: LeagueStats[] = content.summoner.league_stats.map((league: any) => new LeagueStats(
                new QueueInfo(
                    league.queue_info.id,
                    league.queue_info.queue_translate,
                    league.queue_info.game_type
                ),
                new Tier(
                    league.tier_info.tier,
                    league.tier_info.division,
                    league.tier_info.lp,
                    league.tier_info.tier_image_url,
                    league.tier_info.border_image_url
                ),
                league.win,
                league.lose,
                league.is_hot_streak,
                league.is_fresh_blood,
                league.is_veteran,
                league.is_inactive,
                league.series,
                new Date(league.updated_at)
            ));

            const mostChampions: ChampionStats[] = content.summoner.most_champions.champion_stats.map((champion: any) => new ChampionStats(
                this.allChampions.find(c => c.id === champion.id),
                champion.play,
                champion.win,
                champion.lose,
                champion.kill,
                champion.death,
                champion.assist,
                champion.gold_earned,
                champion.minion_kill,
                champion.turret_kill,
                champion.neutral_minion_kill,
                champion.damage_dealt,
                champion.damage_taken,
                champion.physical_damage_dealt,
                champion.magic_damage_dealt,
                champion.most_kill,
                champion.max_kill,
                champion.max_death,
                champion.double_kill,
                champion.triple_kill,
                champion.quadra_kill,
                champion.penta_kill,
                champion.game_length_second
            ));

            const recentGameStats: Game[] = content.summoner.recent_game_stats.map((game: any) => new Game(
                game.game_id,
                this.allChampions.find(c => c.id === game.champion_id),
                game.kill,
                game.death,
                game.assist,
                game.position,
                game.is_win,
                game.is_remake,
                game.op_score,
                game.op_score_rank,
                game.is_opscore_max_in_team,
                new Date(game.created_at)
            ));

            return new Summoner(
                content.summoner.id,
                content.summoner.summoner_id,
                content.summoner.acct_id,
                content.summoner.puuid,
                content.summoner.name,
                content.summoner.internal_name,
                content.summoner.profile_image_url,
                content.summoner.level,
                new Date(content.summoner.updated_at),
                new Date(content.summoner.renewable_at),
                previousSeasons,
                leagueStats,
                mostChampions,
                recentGameStats
            );
        } catch (error) {
            console.error(`Error parsing summoner data: ${error}`);
            return null;
        }
    }

    async search(summonerNames: string | string[], region: Region = Region.NA): Promise<Summoner[]> {
        this.region = region;
        let pageProperties: any; 

        if (this.cachedPageProps) {
            pageProperties = this.cachedPageProps;
        } else {
            pageProperties = await OPGG.getPageProps(summonerNames, region);
            this.cachedPageProps = pageProperties;
        }


        const summoners: Summoner[] = [];
        for (const id of pageProperties.summoners) {
            this.summonerId = id.summoner_id;
            const summoner = await this.getSummoner();
            summoners.push(summoner);
        }

        return summoners;
    }

    static async getPageProps(summoner_names: string | string[] = "abc", region: Region = Region.NA): Promise<any> {
        if (Array.isArray(summoner_names)) {
            summoner_names = summoner_names.join(",");
        }

        const url = `https://op.gg/multisearch/${region}?summoners=${summoner_names}`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
        };

        try {
            const response = await fetch(url, { headers });
            const htmlContent = await response.text();
            const $ = cheerio.load(htmlContent);

            return JSON.parse($('#__NEXT_DATA__').text()).props.pageProps;
        } catch (error) {
            console.error("Error fetching page properties:", error);
            return {};
        }
    }

    static async getAllSeasons(region: Region = Region.NA, pageProperties: any): Promise<SeasonInfo[]> {
        if (!pageProperties) {
            pageProperties = await OPGG.getPageProps(region);
        }

        const seasons: SeasonInfo[] = Object.values(pageProperties['seasonsById']).map((season: any) => ({
            id: season["id"],
            value: season["value"],
            displayValue: season["display_value"],
            isPreseason: season["is_preseason"]
        }));

        return seasons;
    }

    static async getSeasonBy(by: By, value: number | string | number[] | string[]): Promise<SeasonInfo | SeasonInfo[]> {
        const allSeasons = await OPGG.getAllSeasons();
        let resultSet: SeasonInfo[] = [];

        if (by === By.ID) {
            resultSet = Array.isArray(value) ? allSeasons.filter(season => value.includes(season.id)) : allSeasons.filter(season => season.id === value);
        }
        return resultSet.length > 1 ? resultSet : resultSet[0];
    }

    static async getAllChampions(region: Region = Region.NA, pageProperties: any = null): Promise<Champion[]> {
        if (!pageProperties) {
            try {
                const response = await axios.get(`https://op.gg/api/path/to/champions/${region}`);
                pageProperties = response.data;
            } catch (error) {
                console.error('Error fetching champion data:', error);
                return [];
            }
        }

        const champions: Champion[] = Object.values(pageProperties["championsById"]).map((championData: any) => {
            const spells: Spell[] = championData.spells.map((spellData: any) => new Spell(
                spellData.key,
                spellData.name,
                spellData.description,
                spellData.max_rank,
                spellData.range_burn,
                spellData.cooldown_burn,
                spellData.cost_burn,
                spellData.tooltip,
                spellData.image_url,
                spellData.video_url
            ));

            const skins: Skin[] = championData.skins.map((skinData: any) => {
                const prices: Price[] = skinData.prices ? skinData.prices.map((priceData: any) => new Price(
                    priceData.currency.includes("RP") ? "RP" : "BE",
                    priceData.cost
                )) : [];

                return new Skin(
                    skinData.id,
                    skinData.name,
                    skinData.centered_image,
                    skinData.skin_video_url,
                    prices,
                    skinData.sales
                );
            });

            return new Champion(
                championData.id,
                championData.key,
                championData.name,
                championData.image_url,
                championData.evolve,
                new Passive(
                    championData.passive.name,
                    championData.passive.description,
                    championData.passive.image_url,
                    championData.passive.video_url
                ),
                spells,
                skins
            );
        });

        return champions;
    }

    static async getChampionBy(by: By, value: number | string | number[] | string[], kwargs?: any): Promise<Champion | Champion[]> {
        const allChampions = await OPGG.getAllChampions();
        let resultSet: Champion[] = [];

        switch (by) {
            case By.ID: {
                resultSet = this.filterChampions(allChampions, 'id', value);
                break;
            }
            case By.KEY: {
                resultSet = this.filterChampions(allChampions, 'key', value);
                break;
            }
            case By.NAME: {
                resultSet = this.filterChampions(allChampions, 'name', value);
                break;
            }
            case By.COST: {
                resultSet = this.filterChampionsByCost(allChampions, value, kwargs?.currency);
                break;
            }
        }

        return resultSet.length > 1 ? resultSet : resultSet[0];
    }

    private static filterChampions(champions: Champion[], key: keyof Champion, value: number | string | number[] | string[]): Champion[] {
        return Array.isArray(value)
            ? champions.filter(champion => value.includes(champion[key]))
            : champions.filter(champion => champion[key] === value);
    }

    private static filterChampionsByCost(champions: Champion[], cost: number | number[], currency: string = 'BE'): Champion[] {
        return champions.filter(champion => 
            champion.skins.some(skin => 
                skin.prices.some(price => 
                    price.currency === currency && (Array.isArray(cost) ? cost.includes(price.cost) : price.cost === cost)
                )
            )
        );
    }
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const axios_1 = __importDefault(require("axios"));
const parameterss_1 = require("./parameterss");
const champion_1 = require("./champion");
const season_1 = require("./season");
const summoner_1 = __importDefault(require("./summoner"));
const league_stats_1 = require("./league-stats");
const game_1 = require("./game");
const cheerio = __importStar(require("cheerio"));
class OPGG {
    constructor() {
        this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
        this.headers = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36" };
    }
    setSummonerId(summonerId) {
        this.summonerId = summonerId;
        this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
    }
    setRegion(region) {
        this.region = region;
        this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
    }
    getSummoner() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = yield axios_1.default.get(this.apiUrl, { headers: this.headers });
                const previous_seasons = [];
                const league_stats = []; // Define the LeagueStats type
                const most_champions = []; // Define the ChampionStats type
                const recent_game_stats = []; // Define the Game type
                const content = response.data["data"];
                if (response.status === 200) {
                    for (const season of content["summoner"]["previous_seasons"]) {
                        let temporary_season_info = undefined;
                        if (this.allSeasons) {
                            temporary_season_info = this.allSeasons.find(_season => _season.id === season["season_id"]) || undefined;
                        }
                        previous_seasons.push(new season_1.Season(season["season_id"], new league_stats_1.Tier(season["tier_info"]["tier"], season["tier_info"]["division"], season["tier_info"]["lp"], season["tier_info"]["tier_image_url"], season["tier_info"]["border_image_url"]), season["created_at"]));
                    }
                    for (const league of content["summoner"]["league_stats"]) {
                        league_stats.push(new league_stats_1.LeagueStats(new league_stats_1.QueueInfo(league["queue_info"]["id"], league["queue_info"]["queue_translate"], league["queue_info"]["game_type"]), new league_stats_1.Tier(league["tier_info"]["tier"], league["tier_info"]["division"], league["tier_info"]["lp"], league["tier_info"]["tier_image_url"], league["tier_info"]["border_image_url"]), league["win"], league["lose"], league["is_hot_streak"], league["is_fresh_blood"], league["is_veteran"], league["is_inactive"], league["series"], league["updated_at"]));
                    }
                    for (const champion of content["summoner"]["most_champions"]["champion_stats"]) {
                        let temporary_champ = undefined;
                        if (this.allChampions) {
                            temporary_champ = this.allChampions.find(_champion => _champion.id === champion["id"]) || undefined;
                        }
                        most_champions.push(new champion_1.ChampionStats(temporary_champ, champion["play"], champion["win"], champion["lose"], champion["kill"], champion["death"], champion["assist"], champion["gold_earned"], champion["minion_kill"], champion["turret_kill"], champion["neutral_minion_kill"], champion["damage_dealt"], champion["damage_taken"], champion["physical_damage_dealt"], champion["magic_damage_dealt"], champion["most_kill"], champion["max_kill"], champion["max_death"], champion["double_kill"], champion["triple_kill"], champion["quadra_kill"], champion["penta_kill"], champion["game_length_second"]));
                    }
                    for (const game of content["recent_game_stats"]) {
                        let temporary_champ = undefined;
                        if (this.allChampions) {
                            temporary_champ = this.allChampions.find(_champion => _champion.id === game["champion_id"]) || undefined;
                        }
                        recent_game_stats.push(new game_1.Game(game["game_id"], temporary_champ, game["kill"], game["death"], game["assist"], game["position"], game["is_win"], game["is_remake"], game["op_score"], game["op_score_rank"], game["is_opscore_max_in_team"], game["created_at"]));
                    }
                }
                else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
                return new summoner_1.default(content["summoner"]["id"], content["summoner"]["summoner_id"], content["summoner"]["acct_id"], content["summoner"]["puuid"], content["summoner"]["name"], content["summoner"]["internal_name"], content["summoner"]["profile_image_url"], content["summoner"]["level"], content["summoner"]["updated_at"], content["summoner"]["renewable_at"], previous_seasons, league_stats, most_champions, recent_game_stats);
            }
            catch (error) {
                throw error;
            }
        });
    }
    search(summonerNames, region = parameterss_1.Region.NA) {
        return __awaiter(this, void 0, void 0, function* () {
            this.region = region;
            let pageProperties;
            if (OPGG.pageProperties) {
                pageProperties = OPGG.pageProperties;
                console.log("Using cached page props...");
            }
            else {
                console.log("No cached page props found, fetching...");
                pageProperties = yield OPGG.getPageProps(summonerNames, region); // Assuming getPageProps returns a Promise<PageProps>
                OPGG.pageProperties = pageProperties;
                //THIS IS FINE
            }
            this.allSeasons = yield OPGG.getAllSeasons(this.region, pageProperties); // Assuming getAllSeasons returns a Promise<Season[]>
            this.allChampions = yield OPGG.getAllChampions(this.region, pageProperties); // Assuming getAllChampions returns a Promise<Champion[]>
            //THIS IS FINE TOO
            const summoners = [];
            for (const id of pageProperties.summoners) {
                this.summonerId = id.summoner_id;
                console.log(this.summonerId);
            }
            return summoners;
        });
    }
    static getPageProps(summonerNames = "abc", region = parameterss_1.Region.NA) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(summonerNames)) {
                summonerNames = summonerNames.join(",");
            }
            const url = `https://op.gg/multisearch/${region}?summoners=${summonerNames}`;
            const headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
            };
            try {
                const response = yield axios_1.default.get(url, { headers: headers });
                const $ = cheerio.load(response.data);
                // Parse the HTML content as needed
                // This is a placeholder, adjust the selector as per actual HTML structure
                const pageProperties = JSON.parse($('#__NEXT_DATA__').text()).props.pageProps;
                // TODO: Build out the champion and season objects here
                // ...
                return pageProperties;
            }
            catch (error) {
                console.error(`Error in getPageProps: ${error}`);
                throw error;
            }
        });
    }
    static getAllSeasons(region = parameterss_1.Region.NA, pageProperties = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Revisit this caching logic, as there might be a better way to handle it
            if (pageProperties === null) {
                pageProperties = yield this.getPageProps(region); // Assuming getPageProps is a static method in the same class
                OPGG.pageProperties = pageProperties;
            }
            const seasons = [];
            for (const season of Object.values(pageProperties['seasonsById'])) {
                seasons.push(new season_1.SeasonInfo(season["id"], season["value"], season["display_value"], season["is_preseason"]));
            }
            return seasons;
        });
    }
    static getSeasonBy(by, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const allSeasons = yield OPGG.getAllSeasons(); // Assuming getAllSeasons is a static method in the same class
            const resultSet = [];
            if (by === parameterss_1.By.ID) {
                if (Array.isArray(value)) {
                    for (const season of allSeasons) {
                        for (const id of value) {
                            if (season.id === id) {
                                resultSet.push(season);
                            }
                        }
                    }
                }
                else {
                    const valueAsNumber = typeof value === 'string' ? Number.parseInt(value) : value;
                    for (const season of allSeasons) {
                        if (season.id === valueAsNumber) {
                            resultSet.push(season);
                        }
                    }
                }
            }
            // TODO: Add more ways to get season objs, like by is_preseason, display_name, etc.
            return resultSet.length > 1 ? resultSet : resultSet[0];
        });
    }
    static getAllChampions(region = parameterss_1.Region.NA, pageProperties = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Revisit this caching logic, there might be a better way
            if (pageProperties === null) {
                pageProperties = yield OPGG.getPageProps(region); // Assuming getPageProps is a static method in the same class
                OPGG.pageProperties = pageProperties;
            }
            const champions = [];
            for (const champion of Object.values(pageProperties["championsById"])) {
                const spells = champion.spells.map((spell) => new champion_1.Spell(spell["key"], spell["name"], spell["description"], spell["max_rank"], spell["range_burn"], spell["cooldown_burn"], spell["cost_burn"], spell["tooltip"], spell["image_url"], spell["video_url"]));
                const skins = champion.skins.map((skin) => {
                    const prices = skin["prices"] ? skin["prices"].map((price) => new champion_1.Price(price["currency"].includes("RP") ? price["currency"] : "BE", price["cost"])) : undefined;
                    return new champion_1.Skin(skin["id"], skin["name"], skin["centered_image"], skin["skin_video_url"], prices, skin["sales"]);
                });
                champions.push(new champion_1.Champion(champion["id"], champion["key"], champion["name"], champion["image_url"], champion["evolve"], new champion_1.Passive(champion["passive"]["name"], champion["passive"]["description"], champion["passive"]["image_url"], champion["passive"]["video_url"]), spells, skins));
            }
            return champions;
        });
    }
    static getChampionBy(by, value, additionalArguments) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const allChamps = yield OPGG.getAllChampions(); // Assuming getAllChampions is a static method in the same class
            const resultSet = [];
            switch (by) {
                case parameterss_1.By.ID: {
                    for (const champ of allChamps) {
                        if (Array.isArray(value)) {
                            if (value.includes(champ.id)) {
                                resultSet.push(champ);
                            }
                        }
                        else if (champ.id === value) {
                            resultSet.push(champ);
                        }
                    }
                    break;
                }
                case parameterss_1.By.KEY: {
                    for (const champ of allChamps) {
                        if (Array.isArray(value)) {
                            if (value.includes(champ.key)) {
                                resultSet.push(champ);
                            }
                        }
                        else if (champ.key === value) {
                            resultSet.push(champ);
                        }
                    }
                    break;
                }
                case parameterss_1.By.NAME: {
                    for (const champ of allChamps) {
                        if (Array.isArray(value)) {
                            if (value.includes(champ.name)) {
                                resultSet.push(champ);
                            }
                        }
                        else if (champ.name === value) {
                            resultSet.push(champ);
                        }
                    }
                    break;
                }
                case parameterss_1.By.COST: {
                    for (const champ of allChamps) {
                        if ((_a = champ.skins[0]) === null || _a === void 0 ? void 0 : _a.prices) {
                            for (const price of champ.skins[0].prices) {
                                if (((_b = additionalArguments === null || additionalArguments === void 0 ? void 0 : additionalArguments.currency) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === price.currency && value.includes(price.cost)) {
                                    resultSet.push(champ);
                                }
                            }
                        }
                    }
                    break;
                }
            }
            return resultSet.length > 1 ? resultSet : resultSet[0];
        });
    }
}
exports.default = OPGG;

// @ts-nocheck
import axios from "axios";
import { By, Region } from "./parameterss";
import {
  Champion,
  ChampionStats,
  Passive,
  Price,
  Skin,
  Spell,
} from "./champion";
import { Season, SeasonInfo } from "./season";
import Summoner from "./summoner";
import { LeagueStats, QueueInfo, Tier } from "./league-stats";
import { Game } from "./game";
import * as cheerio from "cheerio";

export default class OPGG {
  private summonerId: string;
  private region: Region;
  private apiUrl: string;
  private headers;
  private allChampions: Champion[] | undefined;
  private allSeasons: SeasonInfo[] | undefined;
  static pageProperties;
  constructor() {
    this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
    };
  }

  public setSummonerId(summonerId: string) {
    this.summonerId = summonerId;
    this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
  }

  public setRegion(region: Region) {
    this.region = region;
    this.apiUrl = `https://op.gg/api/v1.0/internal/bypass/summoners/${this.region}/${this.summonerId}/summary`;
  }

  public async getSummoner(): Promise<Summoner> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(this.apiUrl, { headers: this.headers });

      const previous_seasons: Season[] = [];
      const league_stats: LeagueStats[] = []; // Define the LeagueStats type
      const most_champions: ChampionStats[] = []; // Define the ChampionStats type
      const recent_game_stats: Game[] = []; // Define the Game type
      const content = response.data["data"];
      if (response.status === 200) {
        for (const season of content["summoner"]["previous_seasons"]) {
          let temporary_season_info: Season | undefined = undefined;
          if (this.allSeasons) {
            temporary_season_info =
              this.allSeasons.find(
                (_season) => _season.id === season["season_id"]
              ) || undefined;
          }

          previous_seasons.push(
            new Season(
              season["season_id"],
              new Tier(
                season["tier_info"]["tier"],
                season["tier_info"]["division"],
                season["tier_info"]["lp"],
                season["tier_info"]["tier_image_url"],
                season["tier_info"]["border_image_url"]
              ),
              season["created_at"]
            )
          );
        }

        for (const league of content["summoner"]["league_stats"]) {
          league_stats.push(
            new LeagueStats(
              new QueueInfo(
                league["queue_info"]["id"],
                league["queue_info"]["queue_translate"],
                league["queue_info"]["game_type"]
              ),
              new Tier(
                league["tier_info"]["tier"],
                league["tier_info"]["division"],
                league["tier_info"]["lp"],
                league["tier_info"]["tier_image_url"],
                league["tier_info"]["border_image_url"]
              ),
              league["win"],
              league["lose"],
              league["is_hot_streak"],
              league["is_fresh_blood"],
              league["is_veteran"],
              league["is_inactive"],
              league["series"],
              league["updated_at"]
            )
          );
        }

        for (const champion of content["summoner"]["most_champions"][
          "champion_stats"
        ]) {
          let temporary_champ: Champion | undefined = undefined;
          if (this.allChampions) {
            temporary_champ =
              this.allChampions.find(
                (_champion) => _champion.id === champion["id"]
              ) || undefined;
          }

          most_champions.push(
            new ChampionStats(
              temporary_champ,
              champion["play"],
              champion["win"],
              champion["lose"],
              champion["kill"],
              champion["death"],
              champion["assist"],
              champion["gold_earned"],
              champion["minion_kill"],
              champion["turret_kill"],
              champion["neutral_minion_kill"],
              champion["damage_dealt"],
              champion["damage_taken"],
              champion["physical_damage_dealt"],
              champion["magic_damage_dealt"],
              champion["most_kill"],
              champion["max_kill"],
              champion["max_death"],
              champion["double_kill"],
              champion["triple_kill"],
              champion["quadra_kill"],
              champion["penta_kill"],
              champion["game_length_second"]
            )
          );
        }

        for (const game of content["recent_game_stats"]) {
          let temporary_champ: Champion | null = undefined;
          if (this.allChampions) {
            temporary_champ =
              this.allChampions.find(
                (_champion) => _champion.id === game["champion_id"]
              ) || undefined;
          }

          recent_game_stats.push(
            new Game(
              game["game_id"],
              temporary_champ,
              game["kill"],
              game["death"],
              game["assist"],
              game["position"],
              game["is_win"],
              game["is_remake"],
              game["op_score"],
              game["op_score_rank"],
              game["is_opscore_max_in_team"],
              game["created_at"]
            )
          );
        }
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      return new Summoner(
        content["summoner"]["id"],
        content["summoner"]["summoner_id"],
        content["summoner"]["acct_id"],
        content["summoner"]["puuid"],
        content["summoner"]["name"],
        content["summoner"]["internal_name"],
        content["summoner"]["profile_image_url"],
        content["summoner"]["level"],
        content["summoner"]["updated_at"],
        content["summoner"]["renewable_at"],
        previous_seasons,
        league_stats,
        most_champions,
        recent_game_stats
      );
    } catch (error) {
      throw error;
    }
  }

  public async search(
    summonerNames: string | string[],
    region: Region = Region.NA
  ): Promise<Summoner[]> {
    this.region = region;
    let pageProperties;
    if (OPGG.pageProperties) {
      pageProperties = OPGG.pageProperties;
      console.log("Using cached page props...");
    } else {
      console.log("No cached page props found, fetching...");
      pageProperties = await OPGG.getPageProps(summonerNames, region); // Assuming getPageProps returns a Promise<PageProps>
      OPGG.pageProperties = pageProperties;
      //THIS IS FINE
    }

    this.allSeasons = await OPGG.getAllSeasons(this.region, pageProperties); // Assuming getAllSeasons returns a Promise<Season[]>
    this.allChampions = await OPGG.getAllChampions(this.region, pageProperties); // Assuming getAllChampions returns a Promise<Champion[]>

    //THIS IS FINE TOO

    const summoners: Summoner[] = [];
    for (const id of pageProperties.summoners) {
      this.summonerId = id.summoner_id; //this is fine
      const summoner = await this.getSummoner(); // THIS BREAKS, INVESTIGATE
      summoners.push(summoner);
      console.log(summoner);
    }

    return summoners;
  }

  public static async getPageProps(
    summonerNames: string | string[] = "abc",
    region: Region = Region.NA
  ): Promise<any> {
    if (Array.isArray(summonerNames)) {
      summonerNames = summonerNames.join(",");
    }

    const url = `https://op.gg/multisearch/${region}?summoners=${summonerNames}`;
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
    };

    try {
      const response = await axios.get(url, { headers: headers });
      const $ = cheerio.load(response.data);

      // Parse the HTML content as needed
      // This is a placeholder, adjust the selector as per actual HTML structure
      const pageProperties = JSON.parse($("#__NEXT_DATA__").text()).props
        .pageProps;

      // TODO: Build out the champion and season objects here
      // ...

      return pageProperties;
    } catch (error) {
      console.error(`Error in getPageProps: ${error}`);
      throw error;
    }
  }

  public static async getAllSeasons(
    region: Region = Region.NA,
    pageProperties: any = undefined
  ): Promise<SeasonInfo[]> {
    // TODO: Revisit this caching logic, as there might be a better way to handle it
    if (pageProperties === null) {
      pageProperties = await this.getPageProps(region); // Assuming getPageProps is a static method in the same class
      OPGG.pageProperties = pageProperties;
    }

    const seasons: SeasonInfo[] = [];
    for (const season of Object.values(pageProperties["seasonsById"])) {
      seasons.push(
        new SeasonInfo(
          season["id"],
          season["value"],
          season["display_value"],
          season["is_preseason"]
        )
      );
    }

    return seasons;
  }

  public static async getSeasonBy(
    by: By,
    value: number | string | number[] | string[]
  ): Promise<SeasonInfo | SeasonInfo[]> {
    const allSeasons = await OPGG.getAllSeasons(); // Assuming getAllSeasons is a static method in the same class
    const resultSet: SeasonInfo[] = [];

    if (by === By.ID) {
      if (Array.isArray(value)) {
        for (const season of allSeasons) {
          for (const id of value) {
            if (season.id === id) {
              resultSet.push(season);
            }
          }
        }
      } else {
        const valueAsNumber =
          typeof value === "string" ? Number.parseInt(value) : value;
        for (const season of allSeasons) {
          if (season.id === valueAsNumber) {
            resultSet.push(season);
          }
        }
      }
    }

    // TODO: Add more ways to get season objs, like by is_preseason, display_name, etc.

    return resultSet.length > 1 ? resultSet : resultSet[0];
  }

  public static async getAllChampions(
    region: Region = Region.NA,
    pageProperties: any = undefined
  ): Promise<Champion[]> {
    // TODO: Revisit this caching logic, there might be a better way
    if (pageProperties === null) {
      pageProperties = await OPGG.getPageProps(region); // Assuming getPageProps is a static method in the same class
      OPGG.pageProperties = pageProperties;
    }

    const champions: Champion[] = [];

    for (const champion of Object.values(pageProperties["championsById"])) {
      const spells: Spell[] = champion.spells.map(
        (spell: any) =>
          new Spell(
            spell["key"],
            spell["name"],
            spell["description"],
            spell["max_rank"],
            spell["range_burn"],
            spell["cooldown_burn"],
            spell["cost_burn"],
            spell["tooltip"],
            spell["image_url"],
            spell["video_url"]
          )
      );

      const skins: Skin[] = champion.skins.map((skin: any) => {
        const prices: Price[] | null = skin["prices"]
          ? skin["prices"].map(
              (price: any) =>
                new Price(
                  price["currency"].includes("RP") ? price["currency"] : "BE",
                  price["cost"]
                )
            )
          : undefined;

        return new Skin(
          skin["id"],
          skin["name"],
          skin["centered_image"],
          skin["skin_video_url"],
          prices,
          skin["sales"]
        );
      });

      champions.push(
        new Champion(
          champion["id"],
          champion["key"],
          champion["name"],
          champion["image_url"],
          champion["evolve"],
          new Passive(
            champion["passive"]["name"],
            champion["passive"]["description"],
            champion["passive"]["image_url"],
            champion["passive"]["video_url"]
          ),
          spells,
          skins
        )
      );
    }

    return champions;
  }

  public static async getChampionBy(
    by: By,
    value: number | string | Array<number | string>,
    additionalArguments?: any
  ): Promise<Champion | Champion[]> {
    const allChamps = await OPGG.getAllChampions(); // Assuming getAllChampions is a static method in the same class
    const resultSet: Champion[] = [];

    switch (by) {
      case By.ID: {
        for (const champ of allChamps) {
          if (Array.isArray(value)) {
            if (value.includes(champ.id)) {
              resultSet.push(champ);
            }
          } else if (champ.id === value) {
            resultSet.push(champ);
          }
        }
        break;
      }

      case By.KEY: {
        for (const champ of allChamps) {
          if (Array.isArray(value)) {
            if (value.includes(champ.key)) {
              resultSet.push(champ);
            }
          } else if (champ.key === value) {
            resultSet.push(champ);
          }
        }
        break;
      }

      case By.NAME: {
        for (const champ of allChamps) {
          if (Array.isArray(value)) {
            if (value.includes(champ.name)) {
              resultSet.push(champ);
            }
          } else if (champ.name === value) {
            resultSet.push(champ);
          }
        }
        break;
      }

      case By.COST: {
        for (const champ of allChamps) {
          if (champ.skins[0]?.prices) {
            for (const price of champ.skins[0].prices) {
              if (
                additionalArguments?.currency?.toUpperCase() ===
                  price.currency &&
                value.includes(price.cost)
              ) {
                resultSet.push(champ);
              }
            }
          }
        }
        break;
      }
    }

    return resultSet.length > 1 ? resultSet : resultSet[0];
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionStats = exports.Champion = exports.Skin = exports.Price = exports.Spell = exports.Passive = void 0;
const parameterss_1 = require("./parameterss");
class Passive {
    constructor(name, description, imageUrl, videoUrl) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
    }
}
exports.Passive = Passive;
class Spell {
    constructor(key, name, description, maxRank, rangeBurn, cooldownBurn, costBurn, tooltip, imageUrl, videoUrl) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.maxRank = maxRank;
        this.rangeBurn = rangeBurn;
        this.cooldownBurn = cooldownBurn;
        this.costBurn = costBurn;
        this.tooltip = tooltip;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
    }
}
exports.Spell = Spell;
class Price {
    constructor(currency, cost) {
        this.currency = currency;
        this.cost = cost;
    }
}
exports.Price = Price;
class Skin {
    constructor(id, name, centeredImage, skinVideoUrl, prices, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sales) {
        this.id = id;
        this.name = name;
        this.centeredImage = centeredImage;
        this.skinVideoUrl = skinVideoUrl;
        this.prices = prices;
        this.sales = sales;
    }
}
exports.Skin = Skin;
class Champion {
    constructor(id, key, name, imageUrl, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evolve, passive, spells, skins) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.imageUrl = imageUrl;
        this.evolve = evolve;
        this.passive = passive;
        this.spells = spells;
        this.skins = skins;
    }
    getCostBy(by = parameterss_1.By.BLUE_ESSENCE) {
        let costValue = 0;
        this.skins.forEach(skin => {
            skin.prices.forEach(price => {
                if (price.currency === by) {
                    costValue = price.cost;
                }
            });
        });
        return costValue;
    }
}
exports.Champion = Champion;
class ChampionStats {
    constructor(champion, play, win, lose, kill, death, assist, goldEarned, minionKill, turretKill, neutralMinionKill, damageDealt, damageTaken, physicalDamageDealt, magicDamageDealt, mostKill, maxKill, maxDeath, doubleKill, tripleKill, quadraKill, pentaKill, gameLengthSecond) {
        this.champion = champion;
        this.play = play;
        this.win = win;
        this.lose = lose;
        this.kill = kill;
        this.death = death;
        this.assist = assist;
        this.goldEarned = goldEarned;
        this.minionKill = minionKill;
        this.turretKill = turretKill;
        this.neutralMinionKill = neutralMinionKill;
        this.damageDealt = damageDealt;
        this.damageTaken = damageTaken;
        this.physicalDamageDealt = physicalDamageDealt;
        this.magicDamageDealt = magicDamageDealt;
        this.mostKill = mostKill;
        this.maxKill = maxKill;
        this.maxDeath = maxDeath;
        this.doubleKill = doubleKill;
        this.tripleKill = tripleKill;
        this.quadraKill = quadraKill;
        this.pentaKill = pentaKill;
        this.gameLengthSecond = gameLengthSecond;
    }
    get kda() {
        return this.death === 0 ? this.kill + this.assist : (this.kill + this.assist) / this.death;
    }
    get winRate() {
        return this.play === 0 ? 0 : (this.win / this.play) * 100;
    }
}
exports.ChampionStats = ChampionStats;

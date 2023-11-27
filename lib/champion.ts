import { By } from "./parameterss";

export class Passive {
    constructor(
        public name: string,
        public description: string,
        public imageUrl: string,
        public videoUrl: string
    ) {}
}

export class Spell {
    constructor(
        public key: string,
        public name: string,
        public description: string,
        public maxRank: number,
        public rangeBurn: number[],
        public cooldownBurn: number[],
        public costBurn: number[],
        public tooltip: string,
        public imageUrl: string,
        public videoUrl: string
    ) {}
}

export class Price {
    constructor(
        public currency: string,
        public cost: number
    ) {}
}

export class Skin {
    constructor(
        public id: number,
        public name: string,
        public centeredImage: string,
        public skinVideoUrl: string,
        public prices: Price[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public sales: any[] | null
    ) {}
}

export class Champion {
    constructor(
        public id: number,
        public key: string,
        public name: string,
        public imageUrl: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public evolve: any[],
        public passive: Passive,
        public spells: Spell[],
        public skins: Skin[]
    ) {}

    getCostBy(by: By = By.BLUE_ESSENCE): number | null {
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

export class ChampionStats {
    constructor(
        public champion: Champion,
        public play: number,
        public win: number,
        public lose: number,
        public kill: number,
        public death: number,
        public assist: number,
        public goldEarned: number,
        public minionKill: number,
        public turretKill: number,
        public neutralMinionKill: number,
        public damageDealt: number,
        public damageTaken: number,
        public physicalDamageDealt: number,
        public magicDamageDealt: number,
        public mostKill: number,
        public maxKill: number,
        public maxDeath: number,
        public doubleKill: number,
        public tripleKill: number,
        public quadraKill: number,
        public pentaKill: number,
        public gameLengthSecond: number
    ) {}

    get kda(): number {
        return this.death === 0 ? this.kill + this.assist : (this.kill + this.assist) / this.death;
    }

    get winRate(): number {
        return this.play === 0 ? 0 : (this.win / this.play) * 100;
    }

}


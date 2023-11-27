export class Tier {
    constructor(
        public tier: string,
        public division: number,
        public lp: number,
        public tierImageUrl: string,
        public borderImageUrl: string
    ) {}
}

export class QueueInfo {
    constructor(
        public id: number,
        public queueTranslate: string,
        public gameType: string
    ) {}
}

export class LeagueStats {
    constructor(
        public queueInfo: QueueInfo,
        public tierInfo: Tier,
        public win: number,
        public lose: number,
        public isHotStreak: boolean,
        public isFreshBlood: boolean,
        public isVeteran: boolean,
        public isInactive: boolean,
        public series: boolean,
        public updatedAt: Date
    ) {}
}
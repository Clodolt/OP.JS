import { Tier } from "./league-stats";


export class Season {
    constructor(
        public seasonId: number,
        public tierInfo: Tier,
        public createdAt: Date
    ) {}
}

export class SeasonInfo {
    constructor(
        public id: number,
        public value: number,
        public displayValue: number,
        public isPreseason: boolean
    ) {}
}
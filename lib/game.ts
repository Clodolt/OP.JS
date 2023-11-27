import { DateTime } from 'luxon'; 
import { Champion } from './champion';

export class Game {
    private _gameId: string;
    private _champion: Champion;
    private _kill: number;
    private _death: number;
    private _assist: number;
    private _position: string;
    private _isWin: boolean;
    private _isRemake: boolean;
    private _opScore: number;
    private _opScoreRank: number;
    private _isOpscoreMaxInTeam: boolean;
    private _createdAt: DateTime;

    constructor(
        gameId: string,
        champion: Champion,
        kill: number,
        death: number,
        assist: number,
        position: string,
        isWin: boolean,
        isRemake: boolean,
        opScore: number,
        opScoreRank: number,
        isOpscoreMaxInTeam: boolean,
        createdAt: DateTime
    ) {
        this._gameId = gameId;
        this._champion = champion;
        this._kill = kill;
        this._death = death;
        this._assist = assist;
        this._position = position;
        this._isWin = isWin;
        this._isRemake = isRemake;
        this._opScore = opScore;
        this._opScoreRank = opScoreRank;
        this._isOpscoreMaxInTeam = isOpscoreMaxInTeam;
        this._createdAt = createdAt;
    }

    toString(): string {
        return `Game(champion=${this._champion}, kill=${this._kill}, death=${this._death}, assist=${this._assist}, position=${this._position}, isWin=${this._isWin})`;
    }
}

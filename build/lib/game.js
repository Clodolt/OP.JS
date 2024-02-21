"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    constructor(gameId, champion, kill, death, assist, position, isWin, isRemake, opScore, opScoreRank, isOpscoreMaxInTeam, createdAt) {
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
    toString() {
        return `Game(champion=${this._champion}, kill=${this._kill}, death=${this._death}, assist=${this._assist}, position=${this._position}, isWin=${this._isWin})`;
    }
}
exports.Game = Game;

class Bot {
    constructor() {
        this.dynamiteUsed = 0;
        this.opponentsDynamite = 100;
        this.myMoves = [];
        this.oppMoves = [];
        this.myPoints = 0;
        this.oppPoints = 0;
        this.nextRoundPoints = 1;
        this.twoTieMoves = [];
    };

    makeMove(gamestate) {
        if (gamestate.rounds.length === 0) {
            this.resetGameProps();
        }

        const round = gamestate.rounds[gamestate.rounds.length - 1];
        if (typeof round !== 'undefined') {
            this.updateMoves(round);
            this.updateDynamite(round);
            this.updateScore(round);

            if (this.counterOpeningDynamiteAttack(gamestate) === 'W') {
                return 'W';
            }
            if (this.endgameMethods(round) !== undefined) {
                return this.endgameMethods(round);
            }
            if (this.tiebreakStrategy(round) !== undefined) {
                return this.tiebreakStrategy(round);
            }
            return this.randomMove();
        }
        return this.randomMove();
    }

    randomMove() {
        switch(Math.floor(Math.random() * 3)) {
            case 0:
                return 'R';
            case 1:
                return 'P';
            case 2:
                return 'S';
        }
    }

    updateMoves(round) {
        (this.myMoves).push(round.p1);
        (this.oppMoves).push(round.p2);
    }

    updateDynamite(round) {
        if (round.p2 === 'D') {
            this.opponentsDynamite -= 1;
        }
        if (round.p1 === 'D') {
            this.dynamiteUsed += 1;
        }
    }

    updateScore(round) {
        if (round.p1 === round.p2) {
            this.nextRoundPoints += 1;
            return;
        }
        if (
            (round.p1 === 'D' && round.p2 !== 'W') ||
            (round.p1 === 'W' && round.p2 === 'D') ||
            (round.p1 === 'R' && round.p2 === 'S') ||
            (round.p1 === 'S' && round.p2 === 'P') ||
            (round.p1 === 'P' && round.p2 === 'R') ||
            (round.p1 !== 'D' && round.p2 === 'W')
        ) {
            this.myPoints += this.nextRoundPoints;
        } else {
            this.oppPoints += this.nextRoundPoints;
        }
        this.nextRoundPoints = 1;
    }

    randomMoveAll() {
        switch(Math.floor(Math.random() * ((this.opponentsDynamite > 0) ? 5 : 4))) {
            case 0:
                return 'R';
            case 1:
                return 'P';
            case 2:
                return 'S';
            case 3:
                return 'D';
            case 4:
                return 'W';

        }
    }

    useDynamite() {
        return (this.dynamiteUsed < 99) ? 'D' : this.randomMove();
    }

    resetGameProps() {
        this.dynamiteUsed = 0;
        this.opponentsDynamite = 100;
        this.myMoves = [];
        this.oppMoves = [];
        this.myPoints = 0;
        this.oppPoints = 0;
        this.nextRoundPoints = 1;
        this.twoTieMoves = [];
    }

    win(move) {
        if (move === 'R') {
            return 'P';
        }
        if (move === 'P') {
            return 'S';
        }
        if (move === 'S') {
            return 'R';
        }
    }

    counterOpeningDynamiteAttack(gamestate) {
        const onlyDynamiteCheck = this.oppMoves.filter(move => move === 'D');
        if (gamestate.rounds.length > 1 && this.opponentsDynamite > 0 && this.oppMoves.length === onlyDynamiteCheck.length) {
            return 'W';
        }
    }

    endgameMethods(round) {
        const opponentPointsToWin = 1000 - this.oppPoints;
        const myPointsToWin = 1000 - this.myPoints;
        if ((100 - this.dynamiteUsed) >= myPointsToWin) {
            return this.useDynamite();
        }
        if (this.opponentsDynamite >= opponentPointsToWin) {
            if (round.p2 === 'D') {
                return 'W'
            }
        }
        if ((100 - this.dynamiteUsed) >= opponentPointsToWin) {
            return this.useDynamite();
        }
    }

    updateTiebreakMoves(round) {
        if (this.nextRoundPoints === 3) {
            this.twoTieMoves.push(round.p2);
        }
    }

    tiebreakStrategy(round) {
        this.updateTiebreakMoves(round);
        if (this.nextRoundPoints > 2) {
            if (this.twoTieMoves.length >= 6) {
                if (this.twoTieMoves[this.twoTieMoves.length] === this.twoTieMoves[this.twoTieMoves.length - 1] === this.twoTieMoves[this.twoTieMoves.length - 2]) {
                    const tieBreakMove = this.twoTieMoves[this.twoTieMoves.length];
                    if (tieBreakMove === 'D' && this.opponentsDynamite > 0) {
                        return 'W';
                    }
                    return this.win(tieBreakMove);
                }
            }
            if (this.opponentsDynamite > 0 && (round.p1 === 'W' || round.p2 === 'D')) {
                return this.randomMoveAll();
            }
            if (this.dynamiteUsed < 99 && round.p1 !== 'D') {
                return this.useDynamite();
            }
        }
    }

}

module.exports = new Bot();

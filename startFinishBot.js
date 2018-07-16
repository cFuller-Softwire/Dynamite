class Bot {
    constructor() {
        this.gameProps = {
            "dynamiteUsed" :  0,
            "opponentDynamite" : 100,
            "myMoves" : [],
            "oppMoves" : [],
            "myPoints" : 0,
            "oppPoints" : 0,
            "nextRoundPoints" : 1
        };
    };
    
    makeMove(gamestate) {
        if (gamestate.rounds.length === 0) {
            resetGameProps(this.gameProps);
        }
        const round = gamestate.rounds[gamestate.rounds.length-1];
        if (typeof round !== 'undefined'){
            updateMoves(round, this.gameProps);
            updateDynamite(round, this.gameProps);
            updateScore(round, this.gameProps);
            
            //Protect against opening barrage of Dynamite
            const onlyDynamiteCheck = this.gameProps.oppMoves.filter(move => move === 'D');
            if (gamestate.rounds.length > 1 && this.gameProps.opponentDynamite > 0 && this.gameProps.oppMoves.length === onlyDynamiteCheck.length)
            {
                return 'W';
            }        
            //Finishing Moves:
            //Finish on Dynamite if close
            if ( (100 - this.gameProps.dynamiteUsed) >= (1000 - this.gameProps.myPoints)) {
                return useDynamite(this.gameProps);
            }
            //if opponent close to win and brute force with dynamite
            if ( this.gameProps.opponentDynamite >= (1000 - this.gameProps.oppPoints)) {
                if (round.p2 === 'D') {
                    return 'W'
                }
            }
            //if opponent close to win try and catch up.
            if ((100 - this.gameProps.dynamiteUsed) >= (1000 - this.gameProps.oppPoints)) {
                return useDynamite(this.gameProps);
            }
        return randomMove();   
    }
    return randomMove();  

    // ******** FUNCTIONS *******
    //*************************** 

    function updateMoves(round, gameProps) {
        (gameProps.myMoves).push(round.p1);
        (gameProps.oppMoves).push(round.p2);
    }

    function updateDynamite(round, gameProps) {
        if (round.p2 === 'D'){
            gameProps.opponentDynamite -= 1; 
         }
        if (round.p1 === 'D'){
            gameProps.dynamiteUsed += 1;
        }
     }

    function updateScore(round, gameProps) {
        if (round.p1 === round.p2) {
            gameProps.nextRoundPoints += 1;
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
            gameProps.myPoints += gameProps.nextRoundPoints;
        } else {
            gameProps.oppPoints += gameProps.nextRoundPoints;
        }
        gameProps.nextRoundPoints = 1;
        }
        
    function randomMove() {
            const randomNumber = Math.floor(Math.random() * 3);
            if (randomNumber === 0){
                return 'R';
            } else if (randomNumber === 1){
                return 'P';
            } else if (randomNumber === 2){
                return 'S';
            }
            
            }

    function randomMoveAll(gameProps) {
            const randomNumber = Math.floor(Math.random()* ((gameProps.opponentDynamite > 0)? 5 : 4));
            if (randomNumber === 0){
            return 'R';
            } else if (randomNumber === 1){
            return 'P';
            } else if (randomNumber === 2){
            return 'S';
            } else if (randomNumber === 3){
            return 'D';
            } else if (randomNumber === 4){
            return 'W';
            }
            }
        
    function useDynamite(gameProps) {
            return (gameProps.dynamiteUsed<99)? 'D' : randomMove();
            }
        
    function resetGameProps(gameProps) {
        gameProps.dynamiteUsed = 0;
        gameProps.opponentDynamite = 100;
        gameProps.myMoves = [];
        gameProps.oppMoves = [];
        gameProps.myPoints = 0;
        gameProps.oppPoints = 0;
        gameProps.nextRoundPoints = 1;
                }
                }

   
}

module.exports = new Bot();

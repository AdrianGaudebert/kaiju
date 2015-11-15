define(['const', 'utils'], function (Const, Utils) {
    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var TurnProcessor = function (manager) {
        this.manager = manager;
    };

    TurnProcessor.prototype.advanceState = function () {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        if (gameState.nextState == 'humans') {
            this.startHumansTurn();
        }
        else if (gameState.nextState == 'kaiju') {
            this.startKaijuTurn();
        }
    };

    TurnProcessor.prototype.startHumansTurn = function () {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        gameState.state = 'humans';
        gameState.nextState = 'kaiju';
        gameState.player = 1;
        gameState.turnCurrentTime = 0;
        gameState.humanActionsCount = 0;
    };

    TurnProcessor.prototype.startKaijuTurn = function () {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        gameState.state = 'kaiju';
        gameState.nextState = 'humans';
        gameState.player = 0;
        gameState.kaijuActionsCount = 0;
    };

    TurnProcessor.prototype.update = function (dt) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        if (gameState.state === 'humans') {
            // The humans are playing.

            if (gameState.humanActionsCount >= 1) {
                // The current player has played, pass the turn to the next one.
                var nextPlayer = gameState.player;
                nextPlayer = nextPlayer % (Const.PLAYERS_NUMBER - 1);
                gameState.player = nextPlayer + 1;
                gameState.humanActionsCount = 0;
            }

            // Last thing, increase the timer and change the state if needed.
            gameState.turnCurrentTime += dt;
            if (gameState.turnCurrentTime > Const.TURN_TIME) {
                this.advanceState();
            }
        }
        else if (gameState.state === 'kaiju') {
            // The kaiju is playing.
            if (gameState.kaijuActionsCount >= 2) {
                this.advanceState();
            }
        }
    };

    return TurnProcessor;
});

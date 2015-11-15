define(['const', 'utils'], function (Const, Utils) {
    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var TurnProcessor = function (manager) {
        this.manager = manager;
    };

    TurnProcessor.prototype.update = function (dt) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        if (gameState.state === 'humans') {
            // The humans are playing.

            if (gameState.humanActionsCount >= 1) {
                // The current player has played, pass the turn to the next one.
                var nextPlayer = gameState.player;
                nextPlayer = nextPlayer % Const.PLAYERS_NUMBER;
                gameState.player = nextPlayer + 1;
            }

            // Last thing, increase the timer and change the state if needed.
            gameState.turnCurrentTime += dt;
            if (gameState.turnCurrentTime > Const.TURN_TIME) {
                gameState.state = 'kaiju';
                gameState.player = 0;
                gameState.humanActionsCount = 0;
            }
        }
        else if (gameState.state === 'kaiju') {
            // The kaiju is playing.
            if (gameState.kaijuActionsCount >= 2) {
                gameState.state = 'humans';
                gameState.player = 1;
                gameState.turnCurrentTime = 0;
                gameState.kaijuActionsCount = 0;
            }
        }
    };

    return TurnProcessor;
});

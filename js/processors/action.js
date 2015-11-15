define(['const', 'utils'], function (Const, Utils) {

    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var ActionProcessor = function (manager) {
        this.manager = manager;
    };

    ActionProcessor.prototype.update = function (dt) {
        var events = this.manager.getComponentsData('Event');

        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        var boardEntity = Utils.getSingleEntity('Board');
        var board = this.manager.getComponentDataForEntity('Board', boardEntity);

        var kaijuEntity = Utils.getSingleEntity(['Kaiju']);

        var humans = this.manager.getComponentsData('Human');

        for (entity in events) {
            var e = events[entity];

            // First, let's remove this event so we don't act on it again.
            this.manager.removeEntity(entity);

            if (e.type == 'click' && e.target == 'board') {
                if (gameState.state == 'kaiju') {
                    var kaijuPos = this.manager.getComponentDataForEntity('Position', kaijuEntity);
                    var kaijuTile = {
                        x: (kaijuPos.x - Const.BOARD.X - Const.TILE_SIZE / 2) / Const.TILE_SIZE,
                        y: (kaijuPos.y - Const.BOARD.Y - Const.TILE_SIZE / 2) / Const.TILE_SIZE,
                    };

                    var targetDist = Math.abs(kaijuTile.x - e.tileX) + Math.abs(kaijuTile.y - e.tileY);

                    if (targetDist > 1) {
                        // This tile is too far, cancel the action.
                        continue;
                    }

                    this.manager.updateComponentDataForEntity('Position', kaijuEntity, {
                        x: Const.BOARD.X + Const.TILE_SIZE * e.tileX + (Const.TILE_SIZE / 2),
                        y: Const.BOARD.Y + Const.TILE_SIZE * e.tileY + (Const.TILE_SIZE / 2),
                    });

                    gameState.kaijuActionsCount += 1;
                }
                else if (gameState.state == 'humans') {
                    var targetCell = e.cellX + e.cellY * 9;

                    if (!board.accessLayer[targetCell]) {
                        // This cell is not accessible, cancel the action.
                        continue;
                    }

                    for (var h in humans) {
                        if (humans[h].number === gameState.player) {
                            this.manager.updateComponentDataForEntity('Position', h, {
                                x: Const.BOARD.X + Const.CELL_SIZE * e.cellX + (Const.CELL_SIZE / 2),
                                y: Const.BOARD.Y + Const.CELL_SIZE * e.cellY + (Const.CELL_SIZE / 2),
                            });
                        }
                    }

                    gameState.humanActionsCount += 1;
                }
            }
        }
    };

    return ActionProcessor;
});

define([
    'const',
    'utils',
], function (
    Const,
    Utils
) {

    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var ActionProcessor = function (manager) {
        this.manager = manager;
    };

    ActionProcessor.prototype.moveHumanTo = function (cellX, cellY) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        var humans = this.manager.getComponentsData('Human');

        for (var h in humans) {
            var player = this.manager.getComponentDataForEntity('Player', h);
            if (player.number === gameState.player) {
                this.manager.updateComponentDataForEntity('Position', h, {
                    x: Const.BOARD.X + Const.CELL_SIZE * cellX + (Const.CELL_SIZE / 2),
                    y: Const.BOARD.Y + Const.CELL_SIZE * cellY + (Const.CELL_SIZE / 2),
                });
            }
        }

        return true;
    };

    ActionProcessor.prototype.drawCard = function (tileX, tileY) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        // Find clicked tile.
        var tiles = this.manager.getComponentsData('Tile');
        var tile = null;
        var pos = tileX + tileY * 3;

        if (pos === 4) return false;

        for (var t in tiles) {
            tile = tiles[t];
            if (tile.pos === pos) {
                break;
            }
        }

        // If there are no cards, cancel the action.
        if (tile.deck.length == 0) {
            return false;
        }

        if (gameState.state == 'humans') {
            // Find the human.
            // Verify that human can draw.
            // Draw the first card.
            var card = tile.deck.shift();

            if (this.manager.entityHasComponent(card, 'HumanCard')) {
                // If it's a HumanCard, boost population.
                console.log('draw human card');
            }
            // If it's a VehicleCard, MovementCard or WeaponCard, store it with the player.
            // If it's a BuildingCard, put it at the bottom of the deck.
        }
        else if (gameState.state == 'kaiju') {
            // Draw the first card.
            var card = tile.deck.shift();

            if (this.manager.entityHasComponent(card, 'HumanCard')) {
                // If it's a HumanCard, boost population.
                console.log('draw human card');
            }
            // If it's a BuildingCard, destroy current tile.
            // If it's a VehicleCard or a WeaponCard, store it with the kaiju.
            // If it's a MovementCard, play again.
        }

        return true;
    };

    ActionProcessor.prototype.update = function (dt) {
        var events = this.manager.getComponentsData('Event');

        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        var boardEntity = Utils.getSingleEntity('Board');
        var board = this.manager.getComponentDataForEntity('Board', boardEntity);

        var kaijuEntity = Utils.getSingleEntity(['Kaiju']);
        var kaiju = this.manager.getComponentDataForEntity('Kaiju', kaijuEntity);

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
                    else if (targetDist === 0) {
                        // User is clicking the same tile, draw a card.
                        if (!this.drawCard(e.tileX, e.tileY)) {
                            // It was not possible to draw, cancel the action.
                            continue;
                        }
                    }
                    else {
                        // Move the kaiju to another tile.
                        this.manager.updateComponentDataForEntity('Position', kaijuEntity, {
                            x: Const.BOARD.X + Const.TILE_SIZE * e.tileX + (Const.TILE_SIZE / 2),
                            y: Const.BOARD.Y + Const.TILE_SIZE * e.tileY + (Const.TILE_SIZE / 2),
                        });
                    }

                    gameState.kaijuActionsCount += 1;
                }
                else if (gameState.state == 'humans') {
                    var targetCell = e.cellX + e.cellY * 9;

                    var drawCells = [0, 3, 6, 27, 30, 33, 54, 57, 60];

                    if (drawCells.indexOf(targetCell) > -1) {
                        // Draw a card.
                        if (!this.drawCard(e.tileX, e.tileY)) {
                            // It was not possible to draw, cancel the action.
                            continue;
                        }
                    }
                    else if (!board.accessLayer[targetCell]) {
                        // This cell is not accessible, cancel the action.
                        continue;
                    }
                    else {
                        // Move the currently playing human.
                        if (!this.moveHumanTo(e.cellX, e.cellY)) {
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
                    }

                    gameState.humanActionsCount += 1;
                }
            }
            else if (e.type == 'click' && e.target == 'gui') {
                if (gameState.state == 'humans') {
                    // It's an attack.
                    if (_.random(2) < 2) {
                        kaiju.life -= 2;
                    }
                }
            }
        }
    };

    return ActionProcessor;
});

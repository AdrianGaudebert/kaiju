define(['const', 'utils'], function (Const, Utils) {

    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var GameGUIProcessor = function (manager) {
        this.manager = manager;

        this.guiElts = {
            humans: this.manager.createEntity(['Text', 'Position']),
            humansTimer: this.manager.createEntity(['Text', 'Position']),
            humansHeads: [],
            kaiju: this.manager.createEntity(['Text', 'Position']),
            kaijuLife: this.manager.createEntity(['Text', 'Position']),
            movement: this.manager.createEntity(['Text', 'Position']),
            decks: [],
        };

        this.manager.updateComponentDataForEntity('Text', this.guiElts.humans, {
            text: 'Humans',
        });
        this.manager.updateComponentDataForEntity('Position', this.guiElts.humans, {
            x: 120,
            y: 40,
        });

        this.manager.updateComponentDataForEntity('Text', this.guiElts.humansTimer, {
            text: '25',
        });
        this.manager.updateComponentDataForEntity('Position', this.guiElts.humansTimer, {
            x: 300,
            y: 40,
        });

        this.manager.updateComponentDataForEntity('Text', this.guiElts.kaiju, {
            text: 'Kaiju',
        });
        this.manager.updateComponentDataForEntity('Position', this.guiElts.kaiju, {
            x: 440,
            y: 40,
        });

        this.manager.updateComponentDataForEntity('Text', this.guiElts.kaijuLife, {
            text: '30',
        });
        this.manager.updateComponentDataForEntity('Position', this.guiElts.kaijuLife, {
            x: 600,
            y: 40,
        });

        this.manager.updateComponentDataForEntity('Position', this.guiElts.movement, {
            x: 780,
            y: 40,
        });

        for (var i = 0; i < 9; i++) {
            if (i === 4) continue;

            var deckX = Const.BOARD.X + (i % 3) * Const.TILE_SIZE + Const.CELL_SIZE / 2;
            var deckY = Const.BOARD.Y + Math.floor(i / 3) * Const.TILE_SIZE + Const.CELL_SIZE / 2;

            // Create the deck numbers.
            this.guiElts.decks[i] = this.manager.createEntity(['Text', 'Position']);

            this.manager.updateComponentDataForEntity('Position', this.guiElts.decks[i], {
                x: deckX,
                y: deckY,
            });
            this.manager.updateComponentDataForEntity('Text', this.guiElts.decks[i], {
                text: '0',
            });
        }
    };

    GameGUIProcessor.prototype.update = function (dt) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        var kaijuEntity = Utils.getSingleEntity(['Kaiju']);
        var kaiju = this.manager.getComponentDataForEntity('Kaiju', kaijuEntity);

        var heads = this.manager.getComponentsData('PlayerHead');

        var timeLeft = Math.ceil((Const.TURN_TIME - gameState.turnCurrentTime) / 1000);
        this.manager.updateComponentDataForEntity('Text', this.guiElts.humansTimer, {
            text: timeLeft.toString(),
        });

        this.manager.updateComponentDataForEntity('Text', this.guiElts.kaijuLife, {
            text: kaiju.life.toString(),
        });

        this.manager.updateComponentDataForEntity('Text', this.guiElts.movement, {
            text: gameState.humanMovement.toString(),
        });


        if (gameState.state === 'kaiju') {
            this.manager.updateComponentDataForEntity('Text', this.guiElts.kaiju, {
                color: 'red',
                size: '40px',
            });
            this.manager.updateComponentDataForEntity('Text', this.guiElts.humans, {
                color: 'white',
                size: '30px',
            });
        }
        else if (gameState.state === 'humans') {
            this.manager.updateComponentDataForEntity('Text', this.guiElts.humans, {
                color: 'red',
                size: '40px',
            });
            this.manager.updateComponentDataForEntity('Text', this.guiElts.kaiju, {
                color: 'white',
                size: '30px',
            });
        }

        // Show only that player's head.
        for (var h in heads) {
            var player = this.manager.getComponentDataForEntity('Player', h);
            if (player.number == gameState.player) {
                // This is the kaiju, show it.
                this.manager.updateComponentDataForEntity('Sprite', h, {
                    visible: true,
                });
            }
            else {
                this.manager.updateComponentDataForEntity('Sprite', h, {
                    visible: false,
                });
            }
        }

        // Update decks' numbers.
        var tiles = this.manager.getComponentsData('Tile');
        for (var t in tiles) {
            var tile = tiles[t];

            if (tile.pos === 4) continue;

            this.manager.updateComponentDataForEntity('Text', this.guiElts.decks[tile.pos], {
                text: tile.deck.length.toString(),
            });
        }
    };

    return GameGUIProcessor;
});

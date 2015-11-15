define(['const', 'manager-singleton'], function (Const, manager) {
    var GameState = function () {};

    GameState.prototype.start = function () {
        var tilesTypes = [
            'powerplant', 'hospital', 'barrack', 'airport', 'poor-district',
            'rich-district', 'district', 'district', 'district'
        ];
        var tiles = _.shuffle(tilesTypes);

        // Create the game state.
        manager.createEntity(['GameState']);

        // Create the background.
        var background = manager.createEntity(['Sprite', 'Position']);
        manager.updateComponentDataForEntity('Sprite', background, {
            sprite: 'assets/gfx/background.png',
        });
        manager.updateComponentDataForEntity('Position', background, {
            x: Const.SCREEN.W  / 2,
            y: Const.SCREEN.H  / 2,
        });

        // Create the board.
        var board = manager.createEntity(['Board']);
        manager.updateComponentDataForEntity('Board', board, {
            tiles: tiles,
        });

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            var e = manager.createEntity(['Position', 'Sprite', 'Tile']);
            manager.updateComponentDataForEntity('Position', e, {
                x: Const.BOARD.X + (Const.TILE_SIZE * (i % 3)) + (Const.TILE_SIZE / 2),
                y: Const.BOARD.Y + (Const.TILE_SIZE * Math.floor(i / 3)) + (Const.TILE_SIZE / 2),
            });
            manager.updateComponentDataForEntity('Sprite', e, {
                sprite: 'assets/gfx/tiles/' + tile + '.png',
            });

            // Create a deck for that tile.
            var deck = manager.createEntity(['Deck']);
            var cardsList = [manager.createEntity(['Card', 'HumanCard'])];

            manager.updateComponentDataForEntity('Tile', e, {
                type: tile,
                deck: cardsList,
                pos: i,
            });
        }

        // Create some GUI backgrounds.
        for (var i = 0; i < 9; i++) {
            if (i === 4) continue;

            var deckX = Const.BOARD.X + (i % 3) * Const.TILE_SIZE + Const.CELL_SIZE / 2;
            var deckY = Const.BOARD.Y + Math.floor(i / 3) * Const.TILE_SIZE + Const.CELL_SIZE / 2;

            // Create the deck backgrounds.
            var deck = manager.createEntity(['Sprite', 'Position']);
            manager.updateComponentDataForEntity('Position', deck, {
                x: deckX,
                y: deckY,
            });
            manager.updateComponentDataForEntity('Sprite', deck, {
                sprite: 'assets/gfx/deck.png',
            });
        }

        // Create the Kaiju.
        var kaiju = manager.createEntity(['Kaiju', 'Position', 'Sprite']);
        manager.updateComponentDataForEntity('Position', kaiju, {
            x: Const.BOARD.X + Const.TILE_SIZE + (Const.TILE_SIZE / 2),
            y: Const.BOARD.Y + Const.TILE_SIZE + (Const.TILE_SIZE / 2),
        });
        manager.updateComponentDataForEntity('Sprite', kaiju, {
            sprite: 'assets/gfx/kaiju.png',
        });

        // Create his head.
        var kaijuHead = manager.createEntity(['Player', 'PlayerHead', 'Sprite', 'Position']);
        manager.updateComponentDataForEntity('Player', kaijuHead, {
            number: 0,
        });
        manager.updateComponentDataForEntity('Position', kaijuHead, {
            x: 1000,
            y: 170,
        });
        manager.updateComponentDataForEntity('Sprite', kaijuHead, {
            sprite: 'assets/gfx/kaiju-big.png',
        });

        // Create some Humans.
        for (var i = 1; i < Const.PLAYERS_NUMBER; i++) {
            var human = manager.createEntity(['Human', 'Player', 'Position', 'Sprite']);
            manager.updateComponentDataForEntity('Player', human, {
                number: i,
            });
            manager.updateComponentDataForEntity('Position', human, {
                x: Const.BOARD.X + Const.CELL_SIZE * i + (Const.CELL_SIZE / 2),
                y: Const.BOARD.Y + Const.CELL_SIZE + (Const.CELL_SIZE / 2),
            });
            manager.updateComponentDataForEntity('Sprite', human, {
                sprite: 'assets/gfx/characters/perso80-0' + i + '.png',
            });

            // Create their heads.
            var head = manager.createEntity(['Player', 'PlayerHead', 'Sprite', 'Position']);
            manager.updateComponentDataForEntity('Player', head, {
                number: i,
            });
            manager.updateComponentDataForEntity('Position', head, {
                x: 1000,
                y: 170,
            });
            manager.updateComponentDataForEntity('Sprite', head, {
                sprite: 'assets/gfx/characters/perso180-0' + i + '.png',
            });
        }
    };

    return GameState;
});

define(['const', 'manager-singleton'], function (Const, manager) {
    var GameState = function () {};

    GameState.prototype.start = function () {
        var tiles = [
            'office', 'hospital', 'building',
            'barrack', 'mall', 'office',
            'school', 'building', 'factory',
        ];

        // Create the game state.
        manager.createEntity(['GameState']);

        // Create the board.
        var board = manager.createEntity(['Board']);
        manager.updateComponentDataForEntity('Board', board, {
            tiles: tiles,
        });

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            var e = manager.createEntity(['Position', 'Sprite']);
            manager.updateComponentDataForEntity('Position', e, {
                x: Const.BOARD.X + (Const.TILE_SIZE * (i % 3)) + (Const.TILE_SIZE / 2),
                y: Const.BOARD.Y + (Const.TILE_SIZE * Math.floor(i / 3)) + (Const.TILE_SIZE / 2),
            });
            manager.updateComponentDataForEntity('Sprite', e, {
                sprite: 'assets/gfx/' + tile + '.png',
            });
        };

        // Create the Kaiju.
        var kaiju = manager.createEntity(['Kaiju', 'Position', 'Sprite']);
        manager.updateComponentDataForEntity('Position', kaiju, {
            x: Const.BOARD.X + Const.TILE_SIZE + (Const.TILE_SIZE / 2),
            y: Const.BOARD.Y + Const.TILE_SIZE + (Const.TILE_SIZE / 2),
        });
        manager.updateComponentDataForEntity('Sprite', kaiju, {
            sprite: 'assets/gfx/kaiju.png',
        });

        // Create some Humans.
        for (var i = 1; i < 3; i++) {
            var human = manager.createEntity(['Human', 'Position', 'Sprite']);
            manager.updateComponentDataForEntity('Human', human, {
                number: i,
            });
            manager.updateComponentDataForEntity('Position', human, {
                x: Const.BOARD.X + Const.CELL_SIZE * i + (Const.CELL_SIZE / 2),
                y: Const.BOARD.Y + Const.CELL_SIZE + (Const.CELL_SIZE / 2),
            });
            manager.updateComponentDataForEntity('Sprite', human, {
                sprite: 'assets/gfx/human.png',
            });
        }
    };

    return GameState;
});

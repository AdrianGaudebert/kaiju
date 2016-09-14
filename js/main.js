(function () {
    'use strict';

    requirejs.config({
        baseUrl: 'js/',

        paths: {
            'bower': '../bower_components',
            'lib': '../lib',
            'pixi': '../bower_components/pixi.js/bin/pixi.min'
        }
    });

    var requestFullscreen = function (elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    };

    require([
        'pixi',
        'manager-singleton',

        'const',

        'components/card',
        'components/human-card',

        'components/board',
        'components/click',
        'components/deck',
        'components/event',
        'components/game-state',
        'components/human',
        'components/kaiju',
        'components/player',
        'components/player-head',
        'components/position',
        'components/sprite',
        'components/text',
        'components/tile',

        'processors/action',
        'processors/game-gui',
        'processors/input',
        'processors/rendering',
        'processors/turn',

        'states/game'
    ], function (
        PIXI,
        entityManager,

        Const,

        CardComp,
        HumanCardComp,

        BoardComp,
        ClickComp,
        DeckComp,
        EventComp,
        GameStateComp,
        HumanComp,
        KaijuComp,
        PlayerComp,
        PlayerHeadComp,
        PositionComp,
        SpriteComp,
        TextComp,
        TileComp,

        ActionProcessor,
        GameGUIProcessor,
        InputProcessor,
        RenderingProcessor,
        TurnProcessor,

        GameState
    ) {
        var container = document.getElementById('stage');

        // Add all components.
        var components = [
            CardComp,
            HumanCardComp,
            BoardComp,
            ClickComp,
            DeckComp,
            EventComp,
            GameStateComp,
            KaijuComp,
            HumanComp,
            PlayerComp,
            PlayerHeadComp,
            PositionComp,
            SpriteComp,
            TextComp,
            TileComp,
        ];
        for (var i = 0; i < components.length; i++) {
            entityManager.addComponent(components[i].name, components[i])
        };

        var renderingProc = new RenderingProcessor(
            entityManager,
            container,
            Const.SCREEN.W,
            Const.SCREEN.H,
            {backgroundColor: 0x000000}
        );

        // Add all processors.
        entityManager.addProcessor(new InputProcessor(entityManager, container));
        entityManager.addProcessor(new ActionProcessor(entityManager));
        entityManager.addProcessor(new TurnProcessor(entityManager));
        entityManager.addProcessor(new GameGUIProcessor(entityManager));
        entityManager.addProcessor(renderingProc);

        var game = new GameState();
        game.start();

        // Start the main loop of the game.
        var timerPrev = performance.now();
        requestAnimationFrame(animate);
        function animate() {
            var now = performance.now();
            var dt = now - timerPrev;
            timerPrev = now;

            entityManager.update(dt);

            requestAnimationFrame(animate);
        }
    });
}());

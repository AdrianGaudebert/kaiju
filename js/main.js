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

    require([
        'pixi',
        'manager-singleton',

        'const',

        'components/board',
        'components/click',
        'components/event',
        'components/game-state',
        'components/human',
        'components/kaiju',
        'components/position',
        'components/sprite',
        'components/text',

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

        BoardComp,
        ClickComp,
        EventComp,
        GameStateComp,
        HumanComp,
        KaijuComp,
        PositionComp,
        SpriteComp,
        TextComp,

        ActionProcessor,
        GameGUIProcessor,
        InputProcessor,
        RenderingProcessor,
        TurnProcessor,

        GameState
    ) {
        var renderer = PIXI.autoDetectRenderer(
            Const.SCREEN.W,
            Const.SCREEN.H,
            {backgroundColor: 0x000000}
        );
        document.getElementById('stage').appendChild(renderer.view);

        var stage = new PIXI.Container();

        // Add all components.
        var components = [
            BoardComp,
            ClickComp,
            EventComp,
            GameStateComp,
            KaijuComp,
            HumanComp,
            PositionComp,
            SpriteComp,
            TextComp,
        ];
        for (var i = 0; i < components.length; i++) {
            entityManager.addComponent(components[i].name, components[i])
        };

        // Add all processors.
        entityManager.addProcessor(new InputProcessor(entityManager));
        entityManager.addProcessor(new ActionProcessor(entityManager));
        entityManager.addProcessor(new TurnProcessor(entityManager));
        entityManager.addProcessor(new GameGUIProcessor(entityManager));
        entityManager.addProcessor(new RenderingProcessor(entityManager, stage));

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
            renderer.render(stage);

            requestAnimationFrame(animate);
        }
    });
}());

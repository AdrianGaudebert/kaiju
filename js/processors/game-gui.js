define(['const', 'utils'], function (Const, Utils) {

    /**
     * A processor that takes care of all things related to handling user actions.
     */
    var GameGUIProcessor = function (manager) {
        this.manager = manager;

        this.guiElts = {
            humans: this.manager.createEntity(['Text', 'Position']),
            humansTimer: this.manager.createEntity(['Text', 'Position']),
            kaiju: this.manager.createEntity(['Text', 'Position']),
            kaijuLife: this.manager.createEntity(['Text', 'Position']),
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
    };

    GameGUIProcessor.prototype.update = function (dt) {
        var gameEntity = Utils.getSingleEntity(['GameState']);
        var gameState = this.manager.getComponentDataForEntity('GameState', gameEntity);

        var kaiju = Utils.getSingleEntity(['Kaiju']);
        var humans = this.manager.getComponentsData('Human');

        var timeLeft = Math.ceil((Const.TURN_TIME - gameState.turnCurrentTime) / 1000);
        this.manager.updateComponentDataForEntity('Text', this.guiElts.humansTimer, {
            text: timeLeft.toString(),
        });
    };

    return GameGUIProcessor;
});

define(['pixi'], function (PIXI) {

    /**
     * A processor that takes care of all things related to displaying the game.
     */
    var RenderingProcessor = function (manager, stage) {
        this.manager = manager;

        this.container = new PIXI.DisplayObjectContainer();
        stage.addChild(this.container);

        // An associative array for entities' sprites.
        // entity id -> sprite
        this.sprites = {};
    };

    RenderingProcessor.prototype.createSprite = function (entity, data) {
        var positionData = this.manager.getComponentDataForEntity('Position', entity);

        var texture = PIXI.Texture.fromImage(data.sprite);
        var sprite = new PIXI.Sprite(texture);

        sprite.position.x = positionData.x;
        sprite.position.y = positionData.y;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        this.container.addChild(sprite);

        this.sprites[entity] = sprite;
    };

    RenderingProcessor.prototype.createText = function (entity, data) {
        var positionData = this.manager.getComponentDataForEntity('Position', entity);

        var text = new PIXI.Text(
            data.text,
            {
                font: '40px Arial',
                fill: 'white',
                align: 'center',
            }
        );

        text.position.x = positionData.x;
        text.position.y = positionData.y;
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        this.container.addChild(text);

        this.sprites[entity] = text;
    };

    RenderingProcessor.prototype.update = function (dt) {
        var entity;

        var displayables = this.manager.getComponentsData('Sprite');

        for (entity in displayables) {
            // if 'deleted' : do not display (no sprite)
            if (displayables[entity].deleted) {
                continue;
            }

            // First create the actual Phaser.Sprite object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createSprite(entity, displayables[entity]);
            }

            var sprite = this.sprites[entity];

            // Then update the position of each sprite.
            var positionData = this.manager.getComponentDataForEntity('Position', entity);
            sprite.x = positionData.x;
            sprite.y = positionData.y;
        }

        var texts = this.manager.getComponentsData('Text');

        for (entity in texts) {
            var t = texts[entity];

            // First create the actual Phaser.Text object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createText(entity, t);
            }

            var text = this.sprites[entity];

            text.text = t.text;

            // Then update the position of each sprite.
            var positionData = this.manager.getComponentDataForEntity('Position', entity);
            text.x = positionData.x;
            text.y = positionData.y;
        }
    };

    return RenderingProcessor;
});

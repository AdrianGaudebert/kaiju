define(['pixi'], function (PIXI) {

    /**
     * A processor that takes care of all things related to displaying the game.
     */
    var RenderingProcessor = function (manager, containerElt, stageWidth, stageHeight, PIXIOptions) {
        this.manager = manager;

        this.renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, PIXIOptions);
        containerElt.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

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

        this.stage.addChild(sprite);

        this.sprites[entity] = sprite;
    };

    RenderingProcessor.prototype.createText = function (entity, data) {
        var positionData = this.manager.getComponentDataForEntity('Position', entity);

        var text = new PIXI.Text(
            data.text,
            {
                font: data.size + ' ' + data.font,
                fill: data.color,
                align: 'center',
            }
        );

        text.position.x = positionData.x;
        text.position.y = positionData.y;
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        this.stage.addChild(text);

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

            // First create the actual PIXI.Sprite object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createSprite(entity, displayables[entity]);
            }

            var sprite = this.sprites[entity];
            sprite.visible = displayables[entity].visible;

            // Then update the position of each sprite.
            var positionData = this.manager.getComponentDataForEntity('Position', entity);
            sprite.x = positionData.x;
            sprite.y = positionData.y;
        }

        var texts = this.manager.getComponentsData('Text');

        for (entity in texts) {
            var t = texts[entity];

            // First create the actual PIXI.Text object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createText(entity, t);
            }

            var text = this.sprites[entity];

            text.text = t.text;
            text.style.font = t.size + ' ' + t.font;
            text.style.fill = t.color;

            // Then update the position of each sprite.
            var positionData = this.manager.getComponentDataForEntity('Position', entity);
            text.x = positionData.x;
            text.y = positionData.y;
        }

        this.renderer.render(this.stage);
    };

    return RenderingProcessor;
});

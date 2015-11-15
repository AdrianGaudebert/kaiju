define(['const'], function (Const) {
    /**
     * A processor that takes care of all things related to handling user inputs.
     */
    var InputProcessor = function (manager) {
        this.manager = manager;

        this.initEvents();
    };

    InputProcessor.prototype.initEvents = function () {
        var target = document.getElementById('stage').firstElementChild;
        target.addEventListener('mousedown', this.clickEvent.bind(this));
        target.addEventListener('touchstart', this.clickEvent.bind(this));
    };

    InputProcessor.prototype.clickEvent = function (eventData) {
        var entity = this.manager.createEntity(['Click']);
        this.manager.updateComponentDataForEntity('Click', entity, {
            x: eventData.clientX,
            y: eventData.clientY,
        });
    };

    InputProcessor.prototype.update = function (dt) {
        var events = this.manager.getComponentsData('Click');

        for (entity in events) {
            var e = events[entity];

            var tileX = Math.ceil((e.x - Const.BOARD.X) / Const.TILE_SIZE) - 1;
            var tileY = Math.ceil((e.y - Const.BOARD.Y) / Const.TILE_SIZE) - 1;

            var cellX = Math.ceil((e.x - Const.BOARD.X) / Const.TILE_SIZE * Const.CELLS_PER_TILE) - 1;
            var cellY = Math.ceil((e.y - Const.BOARD.Y) / Const.TILE_SIZE * Const.CELLS_PER_TILE) - 1;

            var newEvent = this.manager.createEntity(['Event']);
            this.manager.updateComponentDataForEntity('Event', newEvent, {
                type: 'click',
                x: e.x,
                y: e.y,
                tileX: tileX,
                tileY: tileY,
                cellX: cellX,
                cellY: cellY,
            });

            if (tileX >= 0 && tileX < 3 && tileY >= 0 && tileY < 3) {
                this.manager.updateComponentDataForEntity('Event', newEvent, {
                    target: 'board',
                });
            }
            else {
                this.manager.updateComponentDataForEntity('Event', newEvent, {
                    target: 'gui',
                });
            }

            // Now that we have acted on it, let's remove this event.
            this.manager.removeEntity(entity);
        }
    };

    return InputProcessor;
});

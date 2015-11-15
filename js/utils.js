define(['manager-singleton'], function (manager) {
    var getSingleEntity = function (components) {
        var comps = manager.getComponentsData(components);
        var entities = Object.keys(comps);

        if (entities.length !== 1) {
            throw 'Expected a single entity, got ' + entities.length;
        }
        return entities[0];
    };

    return {
        getSingleEntity: getSingleEntity,
    };
});

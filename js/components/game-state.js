define({
    name: 'GameState',
    state: {
        state: 'humans',
        nextState: 'kaiju',

        player: 1,
        turnCurrentTime: 0,

        humanActionsCount: 0,
        kaijuActionsCount: 0,

        humanMovement: 3,
    }
})

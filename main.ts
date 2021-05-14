function define_constants () {
    constants_snake_speed = 50
    color_to_tile = [
    assets.tile`transparency8`,
    assets.tile`white`,
    assets.tile`red`,
    assets.tile`pink`,
    assets.tile`orange`,
    assets.tile`yellow`,
    assets.tile`teal`,
    assets.tile`green`,
    assets.tile`dark_blue`,
    assets.tile`light_blue`,
    assets.tile`purple`,
    assets.tile`light_purple`,
    assets.tile`dark_purple`,
    assets.tile`transparency8`,
    assets.tile`brown`
    ]
    color_to_body = [
    assets.tile`transparency8`,
    assets.tile`white_body`,
    assets.tile`red_body`,
    assets.tile`pink_body`,
    assets.tile`orange_body`,
    assets.tile`yellow_body`,
    assets.tile`teal_body`,
    assets.tile`green_body`,
    assets.tile`dark_blue_body`,
    assets.tile`light_blue_body`,
    assets.tile`purple_body`,
    assets.tile`light_purple_body`,
    assets.tile`dark_purple_body`,
    assets.tile`transparency8`,
    assets.tile`brown_body`
    ]
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        if (!(sprite_snake.vy > 0)) {
            tiles.placeOnTile(sprite_snake, tiles.locationOfSprite(sprite_snake))
            sprite_snake.setVelocity(0, constants_snake_speed * -1)
        }
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        if (!(sprite_snake.vx > 0)) {
            tiles.placeOnTile(sprite_snake, tiles.locationOfSprite(sprite_snake))
            sprite_snake.setVelocity(constants_snake_speed * -1, 0)
        }
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        if (!(sprite_snake.vx < 0)) {
            tiles.placeOnTile(sprite_snake, tiles.locationOfSprite(sprite_snake))
            sprite_snake.setVelocity(constants_snake_speed, 0)
        }
    }
})
function make_player (color: number, col: number, row: number) {
    snake_image = assets.image`player_image_template`
    snake_image.fill(color)
    snake_image.drawRect(0, 0, 7, 7, 15)
    sprite_snake = sprites.create(snake_image, SpriteKind.Player)
    sprites.setDataNumber(sprite_snake, "color", color)
    tiles.setTileAt(tiles.getTileLocation(col - 1, row - 1), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row - 1), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col - 1, row + 0), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row + 0), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row + 0), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col - 1, row + 1), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row + 1), color_to_tile[color])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row + 1), color_to_tile[color])
    tiles.placeOnTile(sprite_snake, tiles.getTileLocation(col, row))
    if (Math.percentChance(25)) {
        sprite_snake.vx = constants_snake_speed
    } else if (Math.percentChance(33)) {
        sprite_snake.vx = constants_snake_speed * -1
    } else if (Math.percentChance(50)) {
        sprite_snake.vy = constants_snake_speed
    } else {
        sprite_snake.vy = constants_snake_speed * -1
    }
    return sprite_snake
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        if (!(sprite_snake.vy < 0)) {
            tiles.placeOnTile(sprite_snake, tiles.locationOfSprite(sprite_snake))
            sprite_snake.setVelocity(0, constants_snake_speed)
        }
    }
})
function make_tilemap () {
    scene.setBackgroundColor(13)
    tiles.setSmallTilemap(tilemap`tilemap`)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`transparency8`, function (sprite, location) {
	
})
let snake_image: Image = null
let sprite_snake: Sprite = null
let color_to_body: Image[] = []
let color_to_tile: Image[] = []
let constants_snake_speed = 0
let sprite_player: Sprite = null
define_constants()
make_tilemap()
sprite_player = make_player(9, randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
scene.cameraFollowSprite(sprite_player)

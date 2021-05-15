namespace SpriteKind {
    export const Tail = SpriteKind.create()
}
function define_constants () {
    constants_snake_speed = 50
    tile_traverse_time = 1000 / constants_snake_speed * tiles.tileWidth()
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
        move_snake(sprite_player, false, false)
    }
})
scene.onOverlapTile(SpriteKind.Tail, assets.tile`transparency8`, function (sprite, location) {
    tiles.setTileAt(location, color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite, "head"), "color")])
    if (!(sprites.readDataBoolean(sprites.readDataSprite(sprite, "head"), "claiming"))) {
        sprites.setDataBoolean(sprites.readDataSprite(sprite, "head"), "claiming", true)
        sprites.setDataNumber(sprites.readDataSprite(sprite, "head"), "start_claim_col", tiles.locationXY(location, tiles.XY.column))
        sprites.setDataNumber(sprites.readDataSprite(sprite, "head"), "start_claim_row", tiles.locationXY(location, tiles.XY.row))
    }
})
function move_snake (snake: Sprite, vx_or_vy: boolean, pos_or_neg: boolean) {
    timer.throttle("snake_color_" + sprites.readDataNumber(snake, "color"), tile_traverse_time, function () {
        sprites.setDataNumber(snake, "llllll_turn", sprites.readDataNumber(snake, "lllll_turn"))
        sprites.setDataNumber(snake, "lllll_turn", sprites.readDataNumber(snake, "llll_turn"))
        sprites.setDataNumber(snake, "llll_turn", sprites.readDataNumber(snake, "lll_turn"))
        sprites.setDataNumber(snake, "lll_turn", sprites.readDataNumber(snake, "ll_turn"))
        sprites.setDataNumber(snake, "ll_turn", sprites.readDataNumber(snake, "l_turn"))
        if (vx_or_vy) {
            if (pos_or_neg) {
                if (!(snake.vx < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed, 0)
                    sprites.setDataNumber(snake, "l_turn", CollisionDirection.Right)
                    if (sprites.readDataNumber(snake, "first_turn") == -1) {
                        sprites.setDataNumber(snake, "first_turn", CollisionDirection.Right)
                    }
                }
            } else {
                if (!(snake.vx > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed * -1, 0)
                    sprites.setDataNumber(snake, "l_turn", CollisionDirection.Left)
                    if (sprites.readDataNumber(snake, "first_turn") == -1) {
                        sprites.setDataNumber(snake, "first_turn", CollisionDirection.Left)
                    }
                }
            }
        } else {
            if (pos_or_neg) {
                if (!(snake.vy < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed)
                    sprites.setDataNumber(snake, "l_turn", CollisionDirection.Bottom)
                    if (sprites.readDataNumber(snake, "first_turn") == -1) {
                        sprites.setDataNumber(snake, "first_turn", CollisionDirection.Bottom)
                    }
                }
            } else {
                if (!(snake.vy > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed * -1)
                    sprites.setDataNumber(snake, "l_turn", CollisionDirection.Top)
                    if (sprites.readDataNumber(snake, "first_turn") == -1) {
                        sprites.setDataNumber(snake, "first_turn", CollisionDirection.Top)
                    }
                }
            }
        }
        sprites.setDataBoolean(snake, "turning", true)
        timer.after(tile_traverse_time, function () {
            sprites.setDataBoolean(snake, "turning", false)
        })
    })
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        move_snake(sprite_player, true, false)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        move_snake(sprite_player, true, true)
    }
})
function make_player (color: number, col: number, row: number) {
    snake_image = assets.image`player_image_template`
    snake_image.fill(color)
    snake_image.drawRect(0, 0, 7, 7, 15)
    sprite_snake = sprites.create(snake_image, SpriteKind.Player)
    sprites.setDataNumber(sprite_snake, "color", color)
    sprites.setDataBoolean(sprite_snake, "turning", false)
    sprites.setDataNumber(sprite_snake, "l_turn", -1)
    sprites.setDataNumber(sprite_snake, "ll_turn", -1)
    sprites.setDataNumber(sprite_snake, "lll_turn", -1)
    sprites.setDataNumber(sprite_snake, "llll_turn", -1)
    sprites.setDataNumber(sprite_snake, "lllll_turn", -1)
    sprites.setDataNumber(sprite_snake, "llllll_turn", -1)
    sprites.setDataNumber(sprite_snake, "start_claim_col", 0)
    sprites.setDataNumber(sprite_snake, "start_claim_row", 0)
    sprites.setDataBoolean(sprite_snake, "claiming", false)
    sprites.setDataNumber(sprite_snake, "first_turn", -1)
    sprite_tail = sprites.create(assets.image`tail`, SpriteKind.Tail)
    sprite_tail.setFlag(SpriteFlag.Invisible, true)
    sprites.setDataSprite(sprite_tail, "head", sprite_snake)
    sprites.setDataSprite(sprite_snake, "tail", sprite_tail)
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
    tiles.placeOnTile(sprite_tail, tiles.getTileLocation(col, row))
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
        move_snake(sprite_player, false, true)
    }
})
function make_tilemap () {
    scene.setBackgroundColor(13)
    tiles.setSmallTilemap(tilemap`tilemap`)
}
function flip_direction (direction: number) {
    if (direction == CollisionDirection.Left) {
        return CollisionDirection.Right
    } else if (direction == CollisionDirection.Top) {
        return CollisionDirection.Bottom
    } else if (direction == CollisionDirection.Right) {
        return CollisionDirection.Left
    } else {
        return CollisionDirection.Top
    }
}
function direction_to_str (direction: number) {
    if (direction == CollisionDirection.Left) {
        return "l"
    } else if (direction == CollisionDirection.Top) {
        return "u"
    } else if (direction == CollisionDirection.Right) {
        return "r"
    } else if (direction == CollisionDirection.Bottom) {
        return "d"
    } else {
        return "-"
    }
}
function get_start (snake_head: Sprite) {
    return tiles.getTileLocation(sprites.readDataNumber(snake_head, "start_claim_col"), sprites.readDataNumber(snake_head, "start_claim_row"))
}
let inside_location: tiles.Location = null
let start: tiles.Location = null
let sprite_tail: Sprite = null
let sprite_snake: Sprite = null
let snake_image: Image = null
let color_to_body: Image[] = []
let color_to_tile: Image[] = []
let tile_traverse_time = 0
let constants_snake_speed = 0
let sprite_player: Sprite = null
make_tilemap()
define_constants()
sprite_player = make_player(9, randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
scene.cameraFollowSprite(sprite_player)
game.onUpdate(function () {
    for (let sprite_snake of sprites.allOfKind(SpriteKind.Player)) {
        if (!(sprites.readDataBoolean(sprite_snake, "turning"))) {
            if (sprite_snake.vy > 0) {
                tiles.placeOnTile(sprites.readDataSprite(sprite_snake, "tail"), tiles.locationInDirection(tiles.locationOfSprite(sprite_snake), CollisionDirection.Top))
            } else if (sprite_snake.vx < 0) {
                tiles.placeOnTile(sprites.readDataSprite(sprite_snake, "tail"), tiles.locationInDirection(tiles.locationOfSprite(sprite_snake), CollisionDirection.Right))
            } else if (sprite_snake.vy < 0) {
                tiles.placeOnTile(sprites.readDataSprite(sprite_snake, "tail"), tiles.locationInDirection(tiles.locationOfSprite(sprite_snake), CollisionDirection.Bottom))
            } else {
                tiles.placeOnTile(sprites.readDataSprite(sprite_snake, "tail"), tiles.locationInDirection(tiles.locationOfSprite(sprite_snake), CollisionDirection.Left))
            }
        }
        if (false) {
            sprite_snake.say("" + direction_to_str(sprites.readDataNumber(sprite_snake, "l_turn")) + ", " + direction_to_str(sprites.readDataNumber(sprite_snake, "ll_turn")) + ", " + direction_to_str(sprites.readDataNumber(sprite_snake, "lll_turn")) + ", " + direction_to_str(sprites.readDataNumber(sprite_snake, "llll_turn")) + ", " + direction_to_str(sprites.readDataNumber(sprite_snake, "lllll_turn")) + ", " + direction_to_str(sprites.readDataNumber(sprite_snake, "llllll_turn")))
        }
    }
})
forever(function () {
    for (let sprite_snake of sprites.allOfKind(SpriteKind.Player)) {
        if (sprite_snake.tileKindAt(TileDirection.Center, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])) {
            pause(20)
            if (tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")]).length > 0) {
                sprites.setDataNumber(sprite_snake, "old_vx", sprite_snake.vx)
                sprites.setDataNumber(sprite_snake, "old_vy", sprite_snake.vy)
                sprite_snake.setVelocity(0, 0)
                sprites.setDataBoolean(sprite_snake, "claiming", false)
                start = get_start(sprite_snake)
                inside_location = tiles.locationInDirection(start, sprites.readDataNumber(sprite_snake, "first_turn"))
                sprites.setDataNumber(sprite_snake, "first_turn", -1)
                tiles.setTileAt(start, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])
                tiles.setTileAt(inside_location, assets.tile`red`)
                for (let location of tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")])) {
                    tiles.setTileAt(location, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])
                }
                pause(1000)
                sprite_snake.setVelocity(sprites.readDataNumber(sprite_snake, "old_vx"), sprites.readDataNumber(sprite_snake, "old_vy"))
                continue;
            }
        }
    }
})

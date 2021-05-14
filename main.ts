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
function draw_line_high_tilemap (from_col: number, from_row: number, to_col: number, to_row: number, tile: Image) {
    dx = to_col - from_col
    dy = to_row - from_row
    xi = 1
    if (dx < 0) {
        xi = -1
        dx = dx * -1
    }
    D = 2 * dx - dy
    x = from_col
    y = from_row
    for (let index = 0; index < to_row - from_row; index++) {
        tiles.setTileAt(tiles.getTileLocation(x, y), tile)
        if (D > 0) {
            x += xi
            D += 2 * (dx - dy)
        } else {
            D += 2 * dx
        }
        y += 1
    }
}
function sort_locations_by_col () {
    for (let index = 0; index <= locations.length - 1; index++) {
        for (let index2 = 0; index2 <= locations.length - 2; index2++) {
            if (tiles.locationXY(locations[index], tiles.XY.column) < tiles.locationXY(locations[index2 + 1], tiles.XY.column)) {
                temp = locations[index2 + 1]
                locations[index2 + 1] = locations[index]
                locations[index] = temp
            }
        }
    }
    locations.push(locations.shift())
}
scene.onOverlapTile(SpriteKind.Tail, assets.tile`transparency8`, function (sprite, location) {
    tiles.setTileAt(location, color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite, "head"), "color")])
})
function move_snake (snake: Sprite, vx_or_vy: boolean, pos_or_neg: boolean) {
    timer.throttle("snake_at_col_" + tiles.locationXY(tiles.locationOfSprite(snake), tiles.XY.column) + "_row_" + tiles.locationXY(tiles.locationOfSprite(snake), tiles.XY.row) + "_turn", tile_traverse_time, function () {
        if (vx_or_vy) {
            if (pos_or_neg) {
                if (!(snake.vx < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed, 0)
                }
            } else {
                if (!(snake.vx > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed * -1, 0)
                }
            }
        } else {
            if (pos_or_neg) {
                if (!(snake.vy < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed)
                }
            } else {
                if (!(snake.vy > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed * -1)
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
// totally not copied from https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function draw_line_tilemap (from_col: number, from_row: number, to_col: number, to_row: number, tile: Image) {
    if (Math.abs(from_row - from_col) < Math.abs(to_col - from_col)) {
        if (from_col > to_col) {
            draw_line_low_tilemap(to_col, to_row, from_col, from_row, tile)
        } else {
            draw_line_low_tilemap(from_col, from_row, to_col, to_row, tile)
        }
    } else {
        if (from_row > to_row) {
            draw_line_high_tilemap(to_col, to_row, from_col, from_row, tile)
        } else {
            draw_line_high_tilemap(from_col, from_row, to_col, to_row, tile)
        }
    }
}
function sort_locations_by_row () {
    for (let index = 0; index <= locations.length - 1; index++) {
        for (let index2 = 0; index2 <= locations.length - 2; index2++) {
            if (tiles.locationXY(locations[index], tiles.XY.row) < tiles.locationXY(locations[index2 + 1], tiles.XY.row)) {
                temp = locations[index2 + 1]
                locations[index2 + 1] = locations[index]
                locations[index] = temp
            }
        }
    }
    locations.push(locations.shift())
}
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
function draw_line_low_tilemap (from_col: number, from_row: number, to_col: number, to_row: number, tile: Image) {
    dx = to_col - from_col
    dy = to_row - from_row
    yi = 1
    if (dy < 0) {
        yi = -1
        dy = dy * -1
    }
    D = 2 * dy - dx
    y = from_row
    x = from_col
    for (let index = 0; index < to_col - from_col; index++) {
        tiles.setTileAt(tiles.getTileLocation(x, y), tile)
        if (D > 0) {
            y += yi
            D += 2 * (dy - dx)
        } else {
            D += 2 * dy
        }
        x += 1
    }
}
let to_location: tiles.Location = null
let from_location: tiles.Location = null
let yi = 0
let sprite_tail: Sprite = null
let sprite_snake: Sprite = null
let snake_image: Image = null
let temp: tiles.Location = null
let locations: tiles.Location[] = []
let y = 0
let x = 0
let D = 0
let xi = 0
let dy = 0
let dx = 0
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
    }
})
forever(function () {
    for (let sprite_snake of sprites.allOfKind(SpriteKind.Player)) {
        if (sprite_snake.tileKindAt(TileDirection.Center, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])) {
            if (tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")]).length > 0) {
                sprites.setDataNumber(sprite_snake, "old_vx", sprite_snake.vx)
                sprites.setDataNumber(sprite_snake, "old_vy", sprite_snake.vy)
                sprite_snake.setVelocity(0, 0)
                locations = tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")])
                sort_locations_by_row()
                sort_locations_by_col()
                for (let index = 0; index <= locations.length - 1; index++) {
                    from_location = locations[index]
                    if (index < locations.length - 1) {
                        to_location = locations[index + 1]
                    } else {
                        to_location = locations[index]
                    }
                    draw_line_tilemap(tiles.locationXY(from_location, tiles.XY.column), tiles.locationXY(from_location, tiles.XY.row), tiles.locationXY(to_location, tiles.XY.column), tiles.locationXY(to_location, tiles.XY.row), color_to_tile[sprites.readDataNumber(sprite_snake, "color")])
                    tiles.setTileAt(from_location, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])
                    tiles.setTileAt(to_location, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])
                    pause(100)
                }
                sprite_snake.setVelocity(sprites.readDataNumber(sprite_snake, "old_vx"), sprites.readDataNumber(sprite_snake, "old_vy"))
                continue;
            }
        }
    }
})

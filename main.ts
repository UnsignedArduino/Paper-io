namespace SpriteKind {
    export const Tail = SpriteKind.create()
}
function claim_area (snake: Sprite) {
    replace_all_tiles_with(color_to_body[sprites.readDataNumber(snake, "color")], color_to_tile[sprites.readDataNumber(snake, "color")])
    top_leftmost = tiles.getTilesByType(color_to_tile[sprites.readDataNumber(snake, "color")])[0]
    tiles.setTileAt(top_leftmost, assets.tile`yellow`)
    scene.centerCameraAt(tiles.locationXY(top_leftmost, tiles.XY.x), tiles.locationXY(top_leftmost, tiles.XY.y))
    while (true) {
        pause(100)
    }
}
function define_constants () {
    constants_snake_speed = 50
    tile_traverse_time = 1000 / constants_snake_speed * tiles.tileWidth()
    valid_colors = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    14
    ]
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
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    die(sprite)
})
function inside (col: number, row: number, fill: Image, border: Image) {
    return !(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), fill)) && !(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), border))
}
scene.onOverlapTile(SpriteKind.Tail, assets.tile`transparency8`, function (sprite, location) {
    tiles.setTileAt(location, color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite, "head"), "color")])
    if (!(sprites.readDataBoolean(sprites.readDataSprite(sprite, "head"), "claiming"))) {
        sprites.setDataBoolean(sprites.readDataSprite(sprite, "head"), "claiming", true)
    }
})
function move_snake (snake: Sprite, vx_or_vy: boolean, pos_or_neg: boolean) {
    timer.throttle("snake_color_" + sprites.readDataNumber(snake, "color"), tile_traverse_time, function () {
        if (vx_or_vy) {
            if (pos_or_neg) {
                if (!(snake.vx < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed, 0)
                    sprites.setDataNumber(snake, "direction", CollisionDirection.Right)
                }
            } else {
                if (!(snake.vx > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed * -1, 0)
                    sprites.setDataNumber(snake, "direction", CollisionDirection.Left)
                }
            }
        } else {
            if (pos_or_neg) {
                if (!(snake.vy < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed)
                    sprites.setDataNumber(snake, "direction", CollisionDirection.Bottom)
                }
            } else {
                if (!(snake.vy > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed * -1)
                    sprites.setDataNumber(snake, "direction", CollisionDirection.Top)
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
function die (snake: Sprite) {
    for (let location of tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")])) {
        tiles.setTileAt(location, assets.tile`transparency8`)
    }
    for (let location of tiles.getTilesByType(color_to_tile[sprites.readDataNumber(sprite_snake, "color")])) {
        tiles.setTileAt(location, assets.tile`transparency8`)
    }
    sprites.readDataSprite(snake, "tail").destroy()
    snake.destroy()
}
// https://en.wikipedia.org/wiki/Flood_fill#Moving_the_recursion_into_a_data_structure
function flood_fill (col: number, row: number, fill_with: Image, border: Image) {
    locations = []
    locations.push(tiles.getTileLocation(col, row))
    while (locations.length > 0) {
        location = locations.shift()
        if (false) {
            tile = tiles.getTileAtLocation(location)
            tiles.setTileAt(location, assets.tile`red`)
            pause(0)
            tiles.setTileAt(location, tile)
        }
        if (inside(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row), fill_with, border)) {
            tiles.setTileAt(location, fill_with)
            if (inside(tiles.locationXY(location, tiles.XY.column) - 1, tiles.locationXY(location, tiles.XY.row), fill_with, border)) {
                locations.push(tiles.locationInDirection(location, CollisionDirection.Left))
            }
            if (inside(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row) - 1, fill_with, border)) {
                locations.push(tiles.locationInDirection(location, CollisionDirection.Top))
            }
            if (inside(tiles.locationXY(location, tiles.XY.column) + 1, tiles.locationXY(location, tiles.XY.row), fill_with, border)) {
                locations.push(tiles.locationInDirection(location, CollisionDirection.Right))
            }
            if (inside(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row) + 1, fill_with, border)) {
                locations.push(tiles.locationInDirection(location, CollisionDirection.Bottom))
            }
        }
    }
}
function direction_to_inside (heading: number, to: number, col: number, row: number) {
    return tiles.locationInDirection(tiles.locationInDirection(tiles.getTileLocation(col, row), flip_direction(heading)), to)
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
    sprites.setDataNumber(sprite_snake, "inside_col", -1)
    sprites.setDataNumber(sprite_snake, "inside_row", -1)
    sprites.setDataNumber(sprite_snake, "direction", -1)
    sprites.setDataBoolean(sprite_snake, "claiming", false)
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
        sprites.setDataNumber(sprite_snake, "direction", CollisionDirection.Right)
    } else if (Math.percentChance(33)) {
        sprite_snake.vx = constants_snake_speed * -1
        sprites.setDataNumber(sprite_snake, "direction", CollisionDirection.Left)
    } else if (Math.percentChance(50)) {
        sprite_snake.vy = constants_snake_speed
        sprites.setDataNumber(sprite_snake, "direction", CollisionDirection.Bottom)
    } else {
        sprite_snake.vy = constants_snake_speed * -1
        sprites.setDataNumber(sprite_snake, "direction", CollisionDirection.Top)
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
function replace_all_tiles_with (_from: Image, to: Image) {
    for (let location of tiles.getTilesByType(_from)) {
        tiles.setTileAt(location, to)
    }
}
let sprite_tail: Sprite = null
let snake_image: Image = null
let tile: Image = null
let location: tiles.Location = null
let locations: tiles.Location[] = []
let sprite_snake: Sprite = null
let valid_colors: number[] = []
let tile_traverse_time = 0
let constants_snake_speed = 0
let top_leftmost: tiles.Location = null
let color_to_tile: Image[] = []
let color_to_body: Image[] = []
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
        for (let color of valid_colors) {
            if (sprite_snake.tileKindAt(TileDirection.Center, color_to_body[color])) {
                die(sprite_snake)
            }
        }
    }
})
forever(function () {
    for (let sprite_snake of sprites.allOfKind(SpriteKind.Player)) {
        if (sprite_snake.tileKindAt(TileDirection.Center, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])) {
            pause(0)
            if (tiles.getTilesByType(color_to_body[sprites.readDataNumber(sprite_snake, "color")]).length > 0) {
                sprites.setDataNumber(sprite_snake, "old_vx", sprite_snake.vx)
                sprites.setDataNumber(sprite_snake, "old_vy", sprite_snake.vy)
                sprite_snake.setVelocity(0, 0)
                sprites.setDataBoolean(sprite_snake, "claiming", false)
                claim_area(sprite_snake)
                sprite_snake.setVelocity(sprites.readDataNumber(sprite_snake, "old_vx"), sprites.readDataNumber(sprite_snake, "old_vy"))
                continue;
            }
        }
    }
})

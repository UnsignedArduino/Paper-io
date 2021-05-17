namespace SpriteKind {
    export const Tail = SpriteKind.create()
}
function claim_area (snake: Sprite) {
    pause(100)
    replace_all_tiles_with(color_to_body[sprites.readDataNumber(snake, "color")], color_to_tile[sprites.readDataNumber(snake, "color")])
    top_leftmost = tiles.getTilesByType(color_to_tile[sprites.readDataNumber(snake, "color")])[0]
    trace(tiles.locationXY(top_leftmost, tiles.XY.column), tiles.locationXY(top_leftmost, tiles.XY.row), color_to_tile[sprites.readDataNumber(snake, "color")])
    for (let location of tiles.getTilesByType(color_to_tile[sprites.readDataNumber(snake, "color")])) {
        tiles.setTileAt(location, assets.tile`temp`)
    }
    while (tiles.getTilesByType(assets.tile`temp`).length > 0) {
        location = tiles.getTilesByType(assets.tile`temp`)[0]
        flood_fill(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row), color_to_tile[sprites.readDataNumber(snake, "color")], assets.tile`wall`)
    }
    for (let location of tiles.getTilesByType(assets.tile`wall`)) {
        tiles.setTileAt(location, color_to_tile[sprites.readDataNumber(snake, "color")])
    }
}
function define_constants () {
    constants_snake_speed = 50
    tile_traverse_time = 1000 / constants_snake_speed * tiles.tileWidth()
    tile_count = tiles.tilemapColumns() * tiles.tilemapRows()
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
    if (sprite_snake == sprite_player) {
        die_player()
    }
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
function rotate_direction_neg_90 (direction: number) {
    if (direction == CollisionDirection.Left) {
        return CollisionDirection.Bottom
    } else if (direction == CollisionDirection.Top) {
        return CollisionDirection.Left
    } else if (direction == CollisionDirection.Right) {
        return CollisionDirection.Top
    } else {
        return CollisionDirection.Right
    }
}
function die (snake: Sprite) {
    sprites.setDataNumber(snake, "claimed_tiles", tiles.getTilesByType(color_to_tile[sprites.readDataNumber(sprite_snake, "color")]).length)
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
        if (show_cursor) {
            tile = tiles.getTileAtLocation(location)
            tiles.setTileAt(location, assets.tile`red`)
            scene.centerCameraAt(tiles.locationXY(location, tiles.XY.x), tiles.locationXY(location, tiles.XY.y))
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
    if (show_cursor) {
        scene.cameraFollowSprite(sprite_player)
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
function die_player () {
    music.footstep.play()
    timer.after(2000, function () {
        game.showLongText("Game over\\n " + "\\nTime: " + format_time(spriteutils.roundWithPrecision((game.runtime() - sprites.readDataNumber(sprite_player, "create_time")) / 1000, 2)) + "\\nClaimed: " + spriteutils.roundWithPrecision(100 * (sprites.readDataNumber(sprite_player, "claimed_tiles") / tile_count), 2) + "%\\n(" + format_si(sprites.readDataNumber(sprite_player, "claimed_tiles")) + "/" + format_si(tile_count) + ")", DialogLayout.Center)
        game.reset()
    })
}
function format_si (number: number) {
    if (number > 1000000000000) {
        return "" + spriteutils.roundWithPrecision(number / 1000000000000, 2) + "T"
    } else if (number > 1000000000) {
        return "" + spriteutils.roundWithPrecision(number / 1000000000, 2) + "G"
    } else if (number > 1000000) {
        return "" + spriteutils.roundWithPrecision(number / 1000000, 2) + "M"
    } else if (number > 1000) {
        return "" + spriteutils.roundWithPrecision(number / 1000, 2) + "k"
    } else {
        return "" + number
    }
}
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
    sprites.setDataNumber(sprite_snake, "create_time", game.runtime())
    sprites.setDataBoolean(sprite_snake, "claiming", false)
    sprites.setDataBoolean(sprite_snake, "bot", true)
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
// https://en.wikipedia.org/wiki/Boundary_tracing#Square_tracing_algorithm
// 
// http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/square.html
function trace (col: number, row: number, fill: Image) {
    location = null
    for (let c = 0; c <= tiles.tilemapColumns() - 1; c++) {
        for (let r = 0; r <= tiles.tilemapRows() - 1; r++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, tiles.tilemapColumns() - 1 - r), fill)) {
                location = tiles.getTileLocation(c, tiles.tilemapColumns() - 1 - r)
                break;
            }
        }
        if (location) {
            break;
        }
    }
    facing = CollisionDirection.Left
    start = location
    tiles.setTileAt(start, assets.tile`wall`)
    tile = tiles.getTileAtLocation(location)
    iterations = 0
    while (true) {
        if (show_cursor) {
            tile = tiles.getTileAtLocation(location)
            tiles.setTileAt(location, assets.tile`yellow`)
            scene.centerCameraAt(tiles.locationXY(location, tiles.XY.x), tiles.locationXY(location, tiles.XY.y))
            pause(0)
            tiles.setTileAt(location, tile)
        }
        if (tiles.tileAtLocationEquals(location, fill) || tiles.tileAtLocationEquals(location, assets.tile`wall`)) {
            tiles.setTileAt(location, assets.tile`wall`)
            facing = rotate_direction_neg_90(facing)
            location = tiles.locationInDirection(location, facing)
        } else {
            facing = rotate_direction_pos_90(facing)
            location = tiles.locationInDirection(location, facing)
        }
        iterations += 1
        if (iterations > 8 && is_same_location(tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row), tiles.locationXY(start, tiles.XY.column), tiles.locationXY(start, tiles.XY.row))) {
            break;
        }
    }
    if (show_cursor) {
        scene.cameraFollowSprite(sprite_player)
    }
}
function rotate_direction_pos_90 (direction: number) {
    if (direction == CollisionDirection.Left) {
        return CollisionDirection.Top
    } else if (direction == CollisionDirection.Top) {
        return CollisionDirection.Right
    } else if (direction == CollisionDirection.Right) {
        return CollisionDirection.Bottom
    } else {
        return CollisionDirection.Left
    }
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
function is_same_location (col1: number, row1: number, col2: number, row2: number) {
    return col1 == col2 && row1 == row2
}
function replace_all_tiles_with (_from: Image, to: Image) {
    for (let location of tiles.getTilesByType(_from)) {
        tiles.setTileAt(location, to)
    }
}
function format_time (secs: number) {
    return "" + Math.idiv(secs, 60) + "m " + spriteutils.roundWithPrecision(secs % 60, 2) + "s"
}
let iterations = 0
let start: tiles.Location = null
let facing: CollisionDirection = null
let sprite_tail: Sprite = null
let snake_image: Image = null
let tile: Image = null
let locations: tiles.Location[] = []
let sprite_snake: Sprite = null
let valid_colors: number[] = []
let tile_count = 0
let tile_traverse_time = 0
let constants_snake_speed = 0
let location: tiles.Location = null
let top_leftmost: tiles.Location = null
let color_to_tile: Image[] = []
let color_to_body: Image[] = []
let sprite_player: Sprite = null
let show_cursor = false
show_cursor = false
make_tilemap()
define_constants()
sprite_player = make_player(9, randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
sprites.setDataBoolean(sprite_player, "bot", false)
scene.cameraFollowSprite(sprite_player)
music.setVolume(200)
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
                if (sprite_snake == sprite_player) {
                    die_player()
                }
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
                if (sprite_snake == sprite_player) {
                    music.footstep.play()
                }
                sprite_snake.setVelocity(sprites.readDataNumber(sprite_snake, "old_vx"), sprites.readDataNumber(sprite_snake, "old_vy"))
                continue;
            }
        }
    }
})

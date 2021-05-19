namespace SpriteKind {
    export const Tail = SpriteKind.create()
    export const HDU = SpriteKind.create()
    export const HUD = SpriteKind.create()
    export const FakeTile = SpriteKind.create()
}
namespace StatusBarKind {
    export const Area = StatusBarKind.create()
}
function claim_area (snake: Sprite) {
    if (show_debug) {
        claim_start_time = game.runtime()
    }
    pause(50)
    for (let sprite_tile of sprites.allOfKind(SpriteKind.FakeTile)) {
        if (sprite_tile.image.equals(color_to_body[sprites.readDataNumber(snake, "color")])) {
            tiles.setTileAt(tiles.locationOfSprite(sprite_tile), color_to_tile[sprites.readDataNumber(snake, "color")])
            sprite_tile.destroy()
        }
    }
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
    if (show_debug) {
        pause(0)
    }
    claim_time = game.runtime() - claim_start_time
}
function define_constants () {
    constants_snake_speed = 50
    max_players = 6
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
    all_colors = [
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
function sprite_count () {
    count = 0
    for (let kind of [SpriteKind.Player, SpriteKind.Tail, SpriteKind.HUD, SpriteKind.FakeTile, SpriteKind.StatusBar]) {
        count += sprites.allOfKind(kind).length
    }
    return count
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player) {
        move_snake(sprite_player, false, false)
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    die(sprite)
    if (sprite == sprite_player) {
        die_player()
    }
})
function set_fake_tile (col: number, row: number, image2: Image) {
    sprite_tile = sprites.create(image2, SpriteKind.FakeTile)
    sprite_tile.z = -0.9
    sprite_tile.setFlag(SpriteFlag.Ghost, true)
    tiles.placeOnTile(sprite_tile, tiles.getTileLocation(col, row))
}
function inside (col: number, row: number, fill: Image, border: Image) {
    return !(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), fill)) && !(tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), border))
}
function move_snake (snake: Sprite, vx_or_vy: boolean, pos_or_neg: boolean) {
    timer.throttle("snake_color_" + sprites.readDataNumber(snake, "color"), tile_traverse_time * 1.5, function () {
        if (vx_or_vy) {
            if (pos_or_neg) {
                if (!(snake.vx < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed, 0)
                    direction = CollisionDirection.Right
                }
            } else {
                if (!(snake.vx > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(constants_snake_speed * -1, 0)
                    direction = CollisionDirection.Left
                }
            }
        } else {
            if (pos_or_neg) {
                if (!(snake.vy < 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed)
                    direction = CollisionDirection.Bottom
                }
            } else {
                if (!(snake.vy > 0)) {
                    tiles.placeOnTile(snake, tiles.locationOfSprite(snake))
                    snake.setVelocity(0, constants_snake_speed * -1)
                    direction = CollisionDirection.Top
                }
            }
        }
        sprites.setDataNumber(snake, "direction", direction)
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
    sprites.setDataNumber(snake, "claimed_tiles", tiles.getTilesByType(color_to_tile[sprites.readDataNumber(snake, "color")]).length)
    sprites.setDataNumber(snake, "die_time", game.runtime())
    for (let sprite_tile of sprites.allOfKind(SpriteKind.FakeTile)) {
        if (sprite_tile.image.equals(color_to_body[sprites.readDataNumber(snake, "color")])) {
            sprite_tile.destroy()
        }
    }
    for (let location of tiles.getTilesByType(color_to_tile[sprites.readDataNumber(snake, "color")])) {
        tiles.setTileAt(location, assets.tile`transparency8`)
    }
    valid_colors.push(sprites.readDataNumber(snake, "color"))
    sprites.readDataSprite(snake, "tail").destroy()
    snake.destroy()
}
// https://en.wikipedia.org/wiki/Flood_fill#Moving_the_recursion_into_a_data_structure
function flood_fill (col: number, row: number, fill_with: Image, border: Image) {
    if (show_debug) {
        flood_start_time = game.runtime()
    }
    locations = []
    locations.push(tiles.getTileLocation(col, row))
    while (locations.length > 0) {
        location = locations.shift()
        if (show_cursor) {
            scene.centerCameraAt(tiles.locationXY(location, tiles.XY.x), tiles.locationXY(location, tiles.XY.y))
            pause(0)
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
    if (show_debug) {
        pause(0)
        flood_time = game.runtime() - flood_start_time
    }
}
function get_fake_tile (col: number, row: number) {
    for (let sprite_tile of sprites.allOfKind(SpriteKind.FakeTile)) {
        if (tiles.locationXY(tiles.locationOfSprite(sprite_tile), tiles.XY.column) == col && tiles.locationXY(tiles.locationOfSprite(sprite_tile), tiles.XY.row) == row) {
            return sprite_tile
        }
    }
    return [][0]
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
        game.showLongText("Game over\\n " + "\\nTime: " + format_time(spriteutils.roundWithPrecision((sprites.readDataNumber(sprite_player, "die_time") - sprites.readDataNumber(sprite_player, "create_time")) / 1000, 2)) + "\\nClaimed: " + spriteutils.roundWithPrecision(100 * (sprites.readDataNumber(sprite_player, "claimed_tiles") / tile_count), 2) + "%\\n(" + format_si(sprites.readDataNumber(sprite_player, "claimed_tiles")) + "/" + format_si(tile_count) + ")", DialogLayout.Center)
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
function make_player (color2: number, col: number, row: number) {
    snake_image = assets.image`player_image_template`
    snake_image.fill(color2)
    snake_image.drawRect(0, 0, 7, 7, 15)
    sprite_snake = sprites.create(snake_image, SpriteKind.Player)
    sprites.setDataNumber(sprite_snake, "color", color2)
    sprites.setDataBoolean(sprite_snake, "turning", false)
    sprites.setDataNumber(sprite_snake, "direction", -1)
    sprites.setDataBoolean(sprite_snake, "have_direction", true)
    sprites.setDataBoolean(sprite_snake, "left_right", Math.percentChance(50))
    sprites.setDataNumber(sprite_snake, "create_time", game.runtime())
    sprites.setDataNumber(sprite_snake, "turn_count", 0)
    sprites.setDataBoolean(sprite_snake, "claiming", false)
    sprites.setDataBoolean(sprite_snake, "bot", true)
    sprite_tail = sprites.create(assets.image`tail`, SpriteKind.Tail)
    sprite_tail.setFlag(SpriteFlag.Invisible, true)
    sprites.setDataSprite(sprite_tail, "head", sprite_snake)
    sprites.setDataSprite(sprite_snake, "tail", sprite_tail)
    tiles.setTileAt(tiles.getTileLocation(col - 1, row - 1), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row - 1), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col - 1, row + 0), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row + 0), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row + 0), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col - 1, row + 1), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 0, row + 1), color_to_tile[color2])
    tiles.setTileAt(tiles.getTileLocation(col + 1, row + 1), color_to_tile[color2])
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
function update_leaderboard () {
    for (let index = 0; index <= 4; index++) {
        top_5_bars[index].right = scene.screenWidth() - 2
        top_5_bars[index].setFlag(SpriteFlag.Invisible, true)
    }
    sorted_snakes_by_area = []
    all_snakes = sprites.allOfKind(SpriteKind.Player)
    for (let index = 0; index < 4; index++) {
        if (all_snakes.length == 0) {
            break;
        }
        sprite_highest_area = all_snakes[0]
        for (let sprite_snake of all_snakes) {
            if (sprites.readDataNumber(sprite_snake, "claimed_tiles") >= sprites.readDataNumber(sprite_highest_area, "claimed_tiles")) {
                sprite_highest_area = sprite_snake
            }
        }
        sorted_snakes_by_area.push(all_snakes.removeAt(all_snakes.indexOf(sprite_highest_area)))
    }
    for (let index = 0; index <= sorted_snakes_by_area.length - 1; index++) {
        top_5_bars[index].value = sprites.readDataNumber(sorted_snakes_by_area[index], "claimed_tiles")
        top_5_bars[index].setColor(sprites.readDataNumber(sorted_snakes_by_area[index], "color"), 13)
        top_5_bars[index].setBarBorder(1, sprites.readDataNumber(sorted_snakes_by_area[index], "color"))
        top_5_bars[index].setLabel("" + spriteutils.roundWithPrecision(sprites.readDataNumber(sorted_snakes_by_area[index], "claimed_tiles") / tile_count * 100, 2) + "%", 15)
        top_5_bars[index].setFlag(SpriteFlag.Invisible, false)
    }
}
// https://en.wikipedia.org/wiki/Boundary_tracing#Square_tracing_algorithm
// 
// http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/square.html
function trace (col: number, row: number, fill: Image) {
    if (show_debug) {
        trace_start_time = game.runtime()
    }
    location = null
    for (let column = 0; column <= tiles.tilemapColumns() - 1; column++) {
        for (let roww = 0; roww <= tiles.tilemapRows() - 1; roww++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, tiles.tilemapColumns() - 1 - roww), fill)) {
                location = tiles.getTileLocation(column, tiles.tilemapColumns() - 1 - roww)
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
    iterations = 0
    while (true) {
        if (show_cursor) {
            scene.centerCameraAt(tiles.locationXY(location, tiles.XY.x), tiles.locationXY(location, tiles.XY.y))
            pause(0)
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
    if (show_debug) {
        pause(0)
        trace_time = game.runtime() - trace_start_time
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
function has_fake_tile (col: number, row: number) {
    if (get_fake_tile(col, row)) {
        return true
    } else {
        return false
    }
}
spriteutils.createRenderable(100, function (screen2) {
    if (show_debug) {
        images.print(screen2, "paper.io debug screen", 2, 2, 15)
        images.print(screen2, "By Unsigned_Arduino", 2, 10, 15)
        images.print(screen2, "FPS: " + fps_count + "/" + fps + " (" + spriteutils.roundWithPrecision(1000 / fps, 2) + " ms)", 2, 18, 15)
        if (!(spriteutils.isDestroyed(sprite_player))) {
            images.print(screen2, "X: " + spriteutils.roundWithPrecision(sprite_player.x, 0) + " Y: " + spriteutils.roundWithPrecision(sprite_player.y, 0) + " C: " + tiles.locationXY(tiles.locationOfSprite(sprite_player), tiles.XY.column) + " R: " + tiles.locationXY(tiles.locationOfSprite(sprite_player), tiles.XY.row), 2, 26, 15)
            images.print(screen2, "Claiming: " + sprites.readDataBoolean(sprite_player, "claiming"), 2, 34, 15)
            images.print(screen2, "Claimed: " + spriteutils.roundWithPrecision(100 * (sprites.readDataNumber(sprite_player, "claimed_tiles") / tile_count), 2) + "% (" + format_si(sprites.readDataNumber(sprite_player, "claimed_tiles")) + "/" + format_si(tile_count) + ")", 2, 42, 15)
            images.print(screen2, "Time alive: " + format_time(spriteutils.roundWithPrecision((game.runtime() - sprites.readDataNumber(sprite_player, "create_time")) / 1000, 2)), 2, 50, 15)
        } else {
            images.print(screen2, "X: _ Y: _ C: _ R: _", 2, 26, 15)
            images.print(screen2, "Claiming: _", 2, 34, 15)
            images.print(screen2, "Claimed: _% (_/" + format_si(tile_count) + ")", 2, 42, 15)
            images.print(screen2, "Time alive: " + format_time(spriteutils.roundWithPrecision((sprites.readDataNumber(sprite_player, "die_time") - sprites.readDataNumber(sprite_player, "create_time")) / 1000, 2)), 2, 50, 15)
        }
        images.print(screen2, "Players: " + sprites.allOfKind(SpriteKind.Player).length + "/" + max_players, 2, 58, 15)
        images.print(screen2, "FT: " + sprites.allOfKind(SpriteKind.FakeTile).length + " E: " + sprite_count(), 2, 66, 15)
        if (claim_time == 0) {
            images.print(screen2, "TT: _ms FT: _ms", 2, 74, 15)
            images.print(screen2, "CT: _ms", 2, 82, 15)
        } else {
            images.print(screen2, "TT: " + trace_time + "ms FT: " + flood_time + "ms", 2, 74, 15)
            images.print(screen2, "CT: " + claim_time + "ms", 2, 82, 15)
        }
    }
})
function replace_all_tiles_with (_from: Image, to: Image) {
    for (let location of tiles.getTilesByType(_from)) {
        tiles.setTileAt(location, to)
    }
}
function clear_fake_tile (col: number, row: number) {
    sprite_tile = get_fake_tile(col, row)
    if (sprite_tile) {
        sprite_tile.destroy()
    }
}
function create_leaderboard () {
    top_5_bars = []
    for (let index = 0; index < 5; index++) {
        top_5_bars.push(statusbars.create(60, 4, StatusBarKind.Area))
    }
    for (let index = 0; index <= 4; index++) {
        top_5_bars[index].top = index * 6 + 2
        top_5_bars[index].z = 20
        top_5_bars[index].max = tile_count
        top_5_bars[index].value = 1000
        top_5_bars[index].setColor(15, 13)
        top_5_bars[index].setBarBorder(1, 15)
        top_5_bars[index].setLabel("0%", 15)
        top_5_bars[index].setStatusBarFlag(StatusBarFlag.InvertFillDirection, true)
    }
}
function format_time (secs: number) {
    return "" + Math.idiv(secs, 60) + "m " + spriteutils.roundWithPrecision(secs % 60, 2) + "s"
}
let sprite_minimap: Sprite = null
let minimap2: minimap.Minimap = null
let fps = 0
let fps_count = 0
let trace_time = 0
let iterations = 0
let start: tiles.Location = null
let facing: CollisionDirection = null
let trace_start_time = 0
let sprite_highest_area: Sprite = null
let all_snakes: Sprite[] = []
let sorted_snakes_by_area: Sprite[] = []
let top_5_bars: StatusBarSprite[] = []
let sprite_tail: Sprite = null
let sprite_snake: Sprite = null
let snake_image: Image = null
let flood_time = 0
let locations: tiles.Location[] = []
let flood_start_time = 0
let direction = 0
let sprite_tile: Sprite = null
let count = 0
let all_colors: number[] = []
let tile_count = 0
let tile_traverse_time = 0
let max_players = 0
let constants_snake_speed = 0
let claim_time = 0
let top_leftmost: tiles.Location = null
let color_to_tile: Image[] = []
let color_to_body: Image[] = []
let claim_start_time = 0
let sprite_player: Sprite = null
let valid_colors: number[] = []
let color2 = 0
let location: tiles.Location = null
let show_debug = false
let show_cursor = false
color.setPalette(
color.Black
)
show_cursor = false
show_debug = false
let spectator_mode = false
make_tilemap()
define_constants()
if (!(spectator_mode)) {
    location = tiles.getTileLocation(randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
    color2 = valid_colors._pickRandom()
    valid_colors.removeAt(valid_colors.indexOf(color2))
    sprite_player = make_player(color2, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
    sprites.setDataBoolean(sprite_player, "bot", false)
    scene.cameraFollowSprite(sprite_player)
}
create_leaderboard()
music.setVolume(200)
color.startFade(color.Black, color.originalPalette, 2000)
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
game.onUpdate(function () {
    fps_count += 1
})
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Player).length < max_players && valid_colors.length > 0) {
        location = null
        for (let index = 0; index < 16; index++) {
            location = tiles.getTileLocation(randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
            if (tiles.tileAtLocationEquals(location, assets.tile`transparency8`)) {
                break;
            }
        }
        if (location) {
            color2 = valid_colors._pickRandom()
            valid_colors.removeAt(valid_colors.indexOf(color2))
            make_player(color2, tiles.locationXY(location, tiles.XY.column), tiles.locationXY(location, tiles.XY.row))
        }
    }
})
game.onUpdateInterval(1000, function () {
    fps = fps_count
    fps_count = 0
})
forever(function () {
    for (let sprite_tail of sprites.allOfKind(SpriteKind.Tail)) {
        if (!(tiles.tileAtLocationEquals(tiles.locationOfSprite(sprite_tail), color_to_tile[sprites.readDataNumber(sprites.readDataSprite(sprite_tail, "head"), "color")]))) {
            if (!(has_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.row)))) {
                set_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.row), color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite_tail, "head"), "color")])
            } else if (!(get_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.row)).image.equals(color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite_tail, "head"), "color")]))) {
                set_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_tail), tiles.XY.row), color_to_body[sprites.readDataNumber(sprites.readDataSprite(sprite_tail, "head"), "color")])
            }
            if (!(sprites.readDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "claiming"))) {
                sprites.setDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "claiming", true)
                if (sprites.readDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "bot")) {
                    if (!(sprites.readDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "have_direction"))) {
                        sprites.setDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "left_right", Math.percentChance(25))
                        sprites.setDataBoolean(sprites.readDataSprite(sprite_tail, "head"), "have_direction", true)
                        sprites.setDataNumber(sprites.readDataSprite(sprite_tail, "head"), "turn_count", 0)
                    }
                }
            }
        }
    }
    for (let sprite_snake of sprites.allOfKind(SpriteKind.Player)) {
        if (sprite_snake.tileKindAt(TileDirection.Center, color_to_tile[sprites.readDataNumber(sprite_snake, "color")])) {
            if (sprites.readDataBoolean(sprite_snake, "claiming")) {
                sprites.setDataNumber(sprite_snake, "old_vx", sprite_snake.vx)
                sprites.setDataNumber(sprite_snake, "old_vy", sprite_snake.vy)
                sprite_snake.setVelocity(0, 0)
                sprites.setDataBoolean(sprite_snake, "claiming", false)
                sprites.setDataBoolean(sprite_snake, "have_direction", false)
                claim_area(sprite_snake)
                if (sprite_snake == sprite_player) {
                    music.footstep.play()
                }
                sprite_snake.setVelocity(sprites.readDataNumber(sprite_snake, "old_vx"), sprites.readDataNumber(sprite_snake, "old_vy"))
                continue;
            }
        } else if (sprites.readDataBoolean(sprite_snake, "bot")) {
            timer.throttle("snake_bot_" + sprites.readDataNumber(sprite_snake, "color") + "_turn", tile_traverse_time * randint(1, 2), function () {
                if (sprites.readDataBoolean(sprite_snake, "claiming") && sprites.readDataNumber(sprite_snake, "turn_count") <= 4) {
                    sprites.changeDataNumberBy(sprite_snake, "turn_count", 1)
                    if (sprites.readDataBoolean(sprite_snake, "have_direction")) {
                        if (sprites.readDataBoolean(sprite_snake, "left_right")) {
                            direction = rotate_direction_neg_90(sprites.readDataNumber(sprite_snake, "direction"))
                        } else {
                            direction = rotate_direction_pos_90(sprites.readDataNumber(sprite_snake, "direction"))
                        }
                    } else {
                        if (Math.percentChance(50)) {
                            direction = rotate_direction_neg_90(sprites.readDataNumber(sprite_snake, "direction"))
                        } else {
                            direction = rotate_direction_pos_90(sprites.readDataNumber(sprite_snake, "direction"))
                        }
                    }
                    if (direction == CollisionDirection.Left) {
                        move_snake(sprite_snake, true, false)
                    } else if (direction == CollisionDirection.Top) {
                        move_snake(sprite_snake, false, false)
                    } else if (direction == CollisionDirection.Right) {
                        move_snake(sprite_snake, true, true)
                    } else if (direction == CollisionDirection.Bottom) {
                        move_snake(sprite_snake, false, true)
                    }
                }
            })
        }
        for (let color3 of all_colors) {
            if (has_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_snake), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_snake), tiles.XY.row))) {
                if (get_fake_tile(tiles.locationXY(tiles.locationOfSprite(sprite_snake), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(sprite_snake), tiles.XY.row)).image.equals(color_to_body[color3])) {
                    die(sprite_snake)
                    if (sprite_snake == sprite_player) {
                        die_player()
                    }
                }
            }
        }
        if (tiles.getTilesByType(color_to_tile[sprites.readDataNumber(sprite_snake, "color")]).length == 0) {
            die(sprite_snake)
            if (sprite_snake == sprite_player) {
                die_player()
            }
        }
        if (!(spriteutils.isDestroyed(sprite_snake))) {
            sprites.setDataNumber(sprite_snake, "claimed_tiles", tiles.getTilesByType(color_to_tile[sprites.readDataNumber(sprite_snake, "color")]).length)
        }
    }
})
game.onUpdateInterval(500, function () {
    if (spectator_mode) {
        if (sprites.allOfKind(SpriteKind.Player).length > 0) {
            scene.cameraFollowSprite(sprites.allOfKind(SpriteKind.Player)[0])
        }
    }
})
game.onUpdateInterval(100, function () {
    minimap2 = minimap.minimap(MinimapScale.Sixteenth, 1, 15)
    if (!(sprite_minimap)) {
        sprite_minimap = sprites.create(minimap.getImage(minimap2), SpriteKind.HUD)
        sprite_minimap.setFlag(SpriteFlag.Ghost, true)
        sprite_minimap.setFlag(SpriteFlag.RelativeToCamera, true)
        sprite_minimap.bottom = scene.screenHeight() - 2
        sprite_minimap.right = scene.screenWidth() - 2
        sprite_minimap.z = 50
    } else {
        sprite_minimap.setImage(minimap.getImage(minimap2))
    }
    update_leaderboard()
})

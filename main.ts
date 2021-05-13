function make_player (color: number, col: number, row: number) {
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
    snake_image = assets.image`player_image_template`
    snake_image.fill(color)
    snake_image.drawRect(0, 0, 7, 7, 15)
    sprite_snake = sprites.create(snake_image, SpriteKind.Player)
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
    return sprite_snake
}
function make_tilemap () {
    scene.setBackgroundColor(13)
    tiles.setSmallTilemap(tilemap`tilemap`)
}
let sprite_snake: Sprite = null
let snake_image: Image = null
let color_to_tile: Image[] = []
make_tilemap()
let sprite_player = make_player(9, randint(2, tiles.tilemapColumns() - 3), randint(2, tiles.tilemapRows() - 3))
scene.cameraFollowSprite(sprite_player)

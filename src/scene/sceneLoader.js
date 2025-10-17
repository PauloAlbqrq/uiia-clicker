import { Tilemap, Tileset, load } from "../base/joaoEngine.js"

const path = "assets/tilesets/"

export default async function loadWorld() {
    const tilesetsData = [
        { tsx: await load(path + "Overworld.tsx"), image: await load(path + "Overworld.png") },
        { tsx: await load(path + "Inner.tsx"), image: await load(path + "Inner.png") }
    ]
    const tileset = new Tileset(tilesetsData)

    const world = await load("assets/tilemaps/mundo.world")
    const tilemaps = []
    const rectangles = {}
    const points = {}

    for (let map of world.maps) {
        const tilemapJSON = await load("assets/tilemaps/" + map.fileName)
        const tilemap = new Tilemap(tileset, tilemapJSON, true)
        tilemap.worldX = map.x
        tilemap.worldY = map.y
        tilemap.width = map.width
        tilemap.height = map.height

        // Position all layers
        for (let layer of tilemap.children) {
            layer.pos.x = map.x
            layer.pos.y = map.y
        }

        // Parse object layers
        for (let layer of tilemap.objects) {
            for (let obj of layer.objects) {
                const target = obj.width && obj.height ? rectangles : points
                target[obj.name] = obj
                target[obj.name].x += map.x
                target[obj.name].y += map.y
            }
        }

        tilemaps.push(tilemap)
    }
    return {world, tilemaps, rectangles, points }
}

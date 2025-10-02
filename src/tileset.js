import {Tileset, load, StaticBody, CollisionBox} from "./base/joaoEngine.js"

const collision = {
		//laguinho
		243: [4, 8, 12, 8],
		244: [16, 12, 0, 4],
		245: [4, 8, 0, 8],
		283: [4, 16, 12, 0],
		285: [4, 16, 0, 0],
		323: [4, 4, 12, 0],
		324: [16, 4, 0, 0],
		325: [4, 4, 0, 0],
		363: [16, 4, 0, -2, 4, 16, 0, 0],
		364: [16, 4, 0, -2, 4, 16, 12, 0],
		403: [16, 8, 0, 8, 4, 16, 0, 0],
		404: [16, 8, 0, 8, 4, 16, 12, 0],
		//casa
		167: [10, 14, 6, 0],
		168: [16, 14, 0, 0],
		170: [16, 14, 0, 0],
		171: [10, 14, 0, 0],
		127: [10, 16, 6, 0],
		128: [16, 16, 0, 0],
		129: [16, 16, 0, 0],
		130: [16, 16, 0, 0],
		131: [10, 16, 0, 0],
		172: [12, 14, 4, 0],
		173: [16, 14, 0, 0],
		174: [16, 14, 0, 0],
		175: [16, 14, 0, 0],
		176: [12, 14, 0, 0],
		132: [12, 16, 4, 0],
		133: [16, 16, 0, 0],
		134: [16, 16, 0, 0],
		135: [16, 16, 0, 0],
		136: [12, 16, 0, 0],
		//pedras
		45: [16, 6, 0, 10],
		46: [16, 6, 0, 10],
		85: [16, 14, 0, 1],
		86: [16, 14, 0, 1],
		204: [16, 16, 0, 2],
		205: [16, 16, 0, 2],
		206: [16, 16, 0, 2],
		207: [16, 16, 0, 0],
		208: [16, 16, 0, 0],
		209: [16, 16, 0, 0],
		210: [16, 16, 0, 0],
		211: [16, 16, 0, 0],
		//colinas	
		405: [4, 16, 0, 0],
		407: [4, 16, 12, 0],
		441: [16, 4, 0, -2, 4, 16, 0, 0],
		442: [16, 4, 0, -2],
		443: [16, 4, 0, -2, 4, 16, 12, 0],
		445: [16, 8, 0, 8, 4, 16, 0, 0],
		446: [16, 8, 0, 8],
		447: [16, 8, 0, 8, 4, 16, 12, 0],
		485: [16, 16, 0, 0],
		486: [16, 16, 0, 0],
		487: [16, 16, 0, 0],
		525: [16, 16, 0, 0],
		526: [16, 16, 0, 0],
		527: [16, 16, 0, 0],
		565: [16, 16, 0, 0],
		566: [16, 16, 0, 0],
		567: [16, 16, 0, 0],
		}

const tileset = new Tileset(await load("assets/tilesets/Overworld.png"), await load("assets/tilesets/Inner.png"))
for(let i = 0; i < Object.keys(collision).length; i++){
	const key = Object.keys(collision)[i]
	const data = collision[key]

	const block = new StaticBody()
	const box = new CollisionBox(data[0], data[1],
					data[2], data[3])
	box.debug = false
	const sprite = tileset.children[key - 1].clone()
	block.add(sprite, box)
	if(data.length > 4){
		const box2 = new CollisionBox(data[4], data[5],
					data[6], data[7])
		box2.debug = false
		block.add(box2)
	}
	tileset.children[key - 1] = block
}

export default tileset

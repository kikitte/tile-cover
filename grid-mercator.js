'use strict';

var tileSize = 256;
var initialResolution = (2 * Math.PI * 6378137) / tileSize;
var originShift = (2 * Math.PI * 6378137) / 2.0;

/**
 * Get the tile for a point at a specified zoom level
 *
 * @name pointToTile
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Array<number>} tile
 * @example
 * var tile = pointToTile(1, 1, 20)
 * //=tile
 */
function pointToTile(x, y, z) {
    var tile = pointToTileFraction(x, y, z);
    tile[0] = Math.floor(tile[0]);
    tile[1] = Math.floor(tile[1]);
    return tile;
}

/**
 * Get the precise fractional tile location for a point at a zoom level
 *
 * @name pointToTileFraction
 * @param {number} x
 * @param {number} lat
 * @param {number} z
 * @returns {Array<number>} tile fraction
 * var tile = pointToTileFraction(30.5, 50.5, 15)
 * //=tile
 */
function pointToTileFraction(x, y, z) {
    var resolution = initialResolution / (1 << z);
    var pixelX = (x + originShift) / resolution;
    var pixelY = (originShift - y) / resolution;
    var tileX = pixelX / tileSize;
    var tileY = pixelY / tileSize;

    return [tileX, tileY, z];
}

/**
 * Get a geojson representation of a tile
 *
 * @name tileToGeoJSON
 * @param {Array<number>} tile
 * @returns {Feature<Polygon>}
 * @example
 * var poly = tileToGeoJSON([5, 10, 10])
 * //=poly
 */
function tileToGeoJSON(tile) {
    var bbox = tileToBBOX(tile);
    var poly = {
        type: 'Polygon',
        coordinates: [
            [
                [bbox[0], bbox[1]],
                [bbox[0], bbox[3]],
                [bbox[2], bbox[3]],
                [bbox[2], bbox[1]],
                [bbox[0], bbox[1]],
            ],
        ],
    };
    return poly;
}

/**
 * Get the bbox of a tile
 *
 * @name tileToBBOX
 * @param {Array<number>} tile
 * @returns {Array<number>} bbox
 * @example
 * var bbox = tileToBBOX([5, 10, 10])
 * //=bbox
 */
function tileToBBOX(tile) {
    var tx = tile[0],
        ty = tile[1],
        tz = tile[2];
    var res = initialResolution / (1 << tz);
    var minx = tx * tileSize * res - originShift,
        maxy = originShift - ty * tileSize * res,
        maxx = (tx + 1) * tileSize * res - originShift,
        miny = originShift - (ty + 1) * tileSize * res;



    return [minx, miny, maxx, maxy];
}

module.exports = {
    pointToTileFraction: pointToTileFraction,
    pointToTile: pointToTile,
    tileToGeoJSON: tileToGeoJSON,
};

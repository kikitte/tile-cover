'use strict';

var tileSize = 256;
var resolutionFactor = 180 / tileSize;

/**
 * Get the tile for a point at a specified zoom level
 *
 * @name pointToTile
 * @param {number} lon
 * @param {number} lat
 * @param {number} z
 * @returns {Array<number>} tile
 * @example
 * var tile = pointToTile(1, 1, 20)
 * //=tile
 */
function pointToTile(lon, lat, z) {
    var tile = pointToTileFraction(lon, lat, z);
    tile[0] = Math.floor(tile[0]);
    tile[1] = Math.floor(tile[1]);
    return tile;
}

/**
 * Get the precise fractional tile location for a point at a zoom level
 *
 * @name pointToTileFraction
 * @param {number} lon
 * @param {number} lat
 * @param {number} z
 * @returns {Array<number>} tile fraction
 * var tile = pointToTileFraction(30.5, 50.5, 15)
 * //=tile
 */
function pointToTileFraction(lon, lat, z) {
    var resolution = resolutionFactor / (1 << z);
    var pixelX = (180 + lon) / resolution;
    var pixelY = (90 - lat) / resolution;
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
    var tx = tile[0];
    var ty = tile[1];
    var tz = tile[2];
    var res = resolutionFactor / (1 << tz);
    return [
        tx * tileSize * res - 180,
        90 - ty * tileSize * res,
        (tx + 1) * tileSize * res - 180,
        90 - (ty + 1) * tileSize * res,
    ];
}

module.exports = {
    pointToTileFraction: pointToTileFraction,
    pointToTile: pointToTile,
    tileToGeoJSON: tileToGeoJSON,
};

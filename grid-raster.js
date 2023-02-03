'use strict';

class RasterGrid {
    constructor(geotransform) {
        this.geotransform = geotransform;
    }
    /**
     * Get the precise fractional tile location for a point at a zoom level
     *
     * @name pointToTileFraction
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Array<number>} tile fraction
     * var tile = pointToTileFraction(30.5, 50.5, 15)
     * //=tile
     */
    pointToTileFraction(x, y, z) {
        return [
            (x - this.geotransform[0]) / this.geotransform[1],
            (y - this.geotransform[3]) / this.geotransform[5],
            z,
        ];
    }
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
    pointToTile(x, y, z) {
        var tile = this.pointToTileFraction(x, y, z);
        tile[0] = Math.floor(tile[0]);
        tile[1] = Math.floor(tile[1]);
        return tile;
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
    tileToGeoJSON(tile) {
        var bbox = [
            this.geotransform[0] + tile[0] * this.geotransform[1],
            this.geotransform[3] + (tile[1] + 1) * this.geotransform[5],
            this.geotransform[0] + (tile[0] + 1) * this.geotransform[1],
            this.geotransform[3] + tile[1] * this.geotransform[5],
        ];
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
}

module.exports = RasterGrid;

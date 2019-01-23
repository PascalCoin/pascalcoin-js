/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const elliptic = require('elliptic');

/**
 * The list of available curves in pascalcoin.
 */
const CURVES = {
  0: 'empty',
  714: 'secp256k1',
  715: 'p384',
  729: 'sect283k1',
  716: 'p521'
};

const ID = Symbol('id');
const NAME = Symbol('name');

/**
 * Simple elliptic curve representation of keys in pascalcoin.
 */
class Curve {
  static get SECP256K1() {
    return 'secp256k1';
  }

  constructor(curve) {
    if (typeof curve === 'number') {
      if (CURVES[curve] === undefined) {
        throw new Error(`Unknown curve: ${curve}`);
      }

      this[ID] = curve;
      this[NAME] = CURVES[curve];
    } else {
      if (Object.values(CURVES).indexOf(curve.toString()) === -1) {
        throw new Error(`Unknown curve: ${curve}`);
      }

      this[NAME] = curve.toString();
      this[ID] = parseInt(Object.keys(CURVES)[Object.values(CURVES).indexOf(this[NAME])], 10);
    }
  }

  /**
     * Gets the id of the curve.
     *
     * @returns {Number}
     */
  get id() {
    return this[ID];
  }

  /**
     * Gets the name of the curve.
     *
     * @returns {String}
     */
  get name() {
    return this[NAME];
  }

  /**
     * Gets the name of the curve.
     *
     * @returns {String}
     */
  toString() {
    return this.name;
  }

  /**
     * Gets the default curve.
     *
     * @returns {Curve}
     */
  static getDefaultCurve() {
    return new Curve(714);
  }

  /**
   *
   * @returns {*}
   */
  get ec() {
    return elliptic.ec(CURVES[this.id]);
  }
}

module.exports = Curve;

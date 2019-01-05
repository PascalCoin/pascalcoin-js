/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const bs58 = require('bs58');

/**
 * Contains methods to convert stuff to various formats.
 */
class BinToText {
  /**
     * Gets the base58 representation of the given buffer.
     *
     * @param {Buffer} buffer
     * @returns {String}
     */
  static base58Encode(buffer) {
    return bs58.encode(buffer);
  }

  static base58Decode(buffer) {
    return bs58.decode(buffer);
  }
}

module.exports = BinToText;

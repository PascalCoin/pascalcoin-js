/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const forge = require('node-forge');

/**
 * Holds methods to hash.
 */
class Hashing {
  /**
   * Calculates the sha256 hash from the given buffers.
   *
   * @param {...Buffer} buffers
   * @returns {Buffer}
   */
  static sha256(...buffers) {
    const md = forge.md.sha256.create();

    buffers.forEach(buffer => md.update(buffer.toString('binary')));
    return Buffer.from(md.digest().toHex(), 'hex');
  }

  /**
   * Calculates the sha512 hash from the given buffers.
   *
   * @param {...Buffer} buffers
   * @returns {Buffer}
   */
  static sha512(...buffers) {
    const md = forge.md.sha512.create();

    buffers.forEach(buffer => md.update(buffer.toString('binary')));
    return Buffer.from(md.digest().toHex(), 'hex');
  }
}

module.exports = Hashing;

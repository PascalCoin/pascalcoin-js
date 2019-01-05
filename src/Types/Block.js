/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


const BigNumber = require('bignumber.js');
const Abstract = require('./Abstract');
const PublicKey = require('./../Keys/PublicKey');
const Currency = require('./Currency');
const OperationHash = require('./OperationHash');
const ByteCollection = require('./../ByteCollection');

const P_BLOCK = Symbol('block');
const P_ENC_PUBKEY = Symbol('enc_pubkey');
const P_REWARD = Symbol('reward');
const P_FEE = Symbol('fee');
const P_VER = Symbol('ver');
const P_VER_A = Symbol('ver_a');
const P_TIMESTAMP = Symbol('timestamp');
const P_TARGET = Symbol('target');
const P_NONCE = Symbol('nonce');
const P_PAYLOAD = Symbol('payload');
const P_SBH = Symbol('sbh');
const P_OPH = Symbol('oph');
const P_POW = Symbol('pow');
const P_HASHRATEKHS = Symbol('hashratekhs');
const P_MATURATION = Symbol('maturation');
const P_OPERATIONS = Symbol('operations');

/**
 * Represents a block.
 */
class Block extends Abstract {
  /**
     * Creates a new instance of the Block class.
     *
     * @param {Object} data
     */
  constructor(data) {
    super(data);

    this[P_BLOCK] = parseInt(data.block, 10);
    this[P_ENC_PUBKEY] = PublicKey.decode(ByteCollection.fromHex(data.enc_pubkey));
    this[P_REWARD] = new Currency(data.reward);
    this[P_FEE] = new Currency(data.fee);
    this[P_VER] = parseInt(data.ver, 10);
    this[P_VER_A] = parseInt(data.ver_a, 10);
    this[P_TIMESTAMP] = parseInt(data.timestamp, 10);
    this[P_TARGET] = new BigNumber(data.target.toString());
    this[P_NONCE] = new BigNumber(data.nonce.toString());
    this[P_PAYLOAD] = ByteCollection.fromHex(data.payload);
    this[P_SBH] = ByteCollection.fromHex(data.sbh);
    this[P_OPH] = OperationHash.decode(ByteCollection.fromHex(data.oph));
    this[P_POW] = ByteCollection.fromHex(data.pow);
    this[P_HASHRATEKHS] = new BigNumber(data.hashratekhs.toString());
    this[P_MATURATION] = parseInt(data.maturation, 10);
    this[P_OPERATIONS] = parseInt(data.operations, 10);
  }

  /**
     * Gets the number of a block.
     *
     * @returns {Number}
     */
  get block() {
    return this[P_BLOCK];
  }

  /**
     * Gets the public key of the miner of the block.
     *
     * @returns {PublicKey}
     */
  get publicKey() {
    return this[P_ENC_PUBKEY];
  }

  /**
     * Gets the reward.
     *
     * @returns {Currency}
     */
  get reward() {
    return this[P_REWARD];
  }

  /**
     * Gets the collective fee awarded to the miner.
     *
     * @returns {Currency}
     */
  get fee() {
    return this[P_FEE];
  }

  /**
     * Gets the version of the protocol.
     *
     * @returns {Number}
     */
  get ver() {
    return this[P_VER];
  }

  /**
     * Gets the protocol version of the miner.
     *
     * @returns {Number}
     */
  get verA() {
    return this[P_VER_A];
  }

  /**
     * Gets the UTC timestamp of the block.
     *
     * @returns {Number}
     */
  get timestamp() {
    return this[P_TIMESTAMP];
  }

  /**
     * Gets the used target.
     *
     * @returns {BigNumber}
     */
  get target() {
    return this[P_TARGET];
  }

  /**
     * Gets the calculated nonce.
     *
     * @returns {BigNumber}
     */
  get nonce() {
    return this[P_NONCE];
  }

  /**
     * Gets the payload of the miner.
     *
     * @returns {ByteCollection}
     */
  get payload() {
    return this[P_PAYLOAD];
  }

  /**
     * Gets the safebox hash.
     *
     * @returns {ByteCollection}
     */
  get sbh() {
    return this[P_SBH];
  }

  /**
     * Gets the operation hash.
     *
     * @returns {ByteCollection}
     */
  get oph() {
    return this[P_OPH];
  }

  /**
     * Gets the POW.
     *
     * @returns {ByteCollection}
     */
  get pow() {
    return this[P_POW];
  }

  /**
     * Gets the hashrate in kh/s.
     *
     * @returns {BigNumber}
     */
  get hashratekhs() {
    return this[P_HASHRATEKHS];
  }

  /**
     * Gets the age of the block in terms of blocks.
     *
     * @returns {Number}
     */
  get maturation() {
    return this[P_MATURATION];
  }

  /**
     * Gets the number of operations in the block.
     *
     * @returns {Number}
     */
  get operations() {
    return this[P_OPERATIONS];
  }
}

module.exports = Block;

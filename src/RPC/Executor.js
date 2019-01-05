const P_CALLER = Symbol('caller');
const P_QUEUE = Symbol('queue');

const PQueue = require('p-queue');
const AccountNumber = require('./../Types/AccountNumber');
const OperationHash = require('./../Types/OperationHash');
const Account = require('./../Types/Account');
const PublicKey = require('./../Keys/PublicKey');
const PrivateKey = require('./../Keys/PrivateKey');
const KeyPair = require('./../Keys/KeyPair');
const Currency = require('./../Types/Currency');
const Block = require('./../Types/Block');
const ByteCollection = require('./../ByteCollection');
const WalletPublicKey = require('./../Types/WalletPublicKey');

/**
 * Simple function that transforms the values of an object to make them usable
 * in rpc calls.
 *
 * @param {Object} params
 * @returns {Object}
 */
function transformRpcParams(params) {
  const newParams = {};
  Object.keys(params).forEach((field) => {
    const item = params[field];

    // we weill delete fields that are null
    if (item === null) {

    } else if (field.indexOf('publicKey') !== -1) {
      // correct the field name..
      const newField = field.replace('publicKey', 'publicKey');

      // and set the value
      if (item instanceof ByteCollection) {
        newParams[newField] = item.toHex();
      } else if (item instanceof PublicKey) {
        newParams[newField] = item.encode.toHex();
      } else if (item instanceof WalletPublicKey) {
        newParams[newField] = item.encode.toHex();
      } else if (item instanceof PrivateKey) {
        newParams[newField] = KeyPair.fromPrivateKey(item).publicKey.encode().toHex();
      } else if (item instanceof KeyPair) {
        newParams[newField] = item.publicKey.encode().toHex();
      } else {
        newParams[newField] = item.toString();
      }
    } else if (field === 'payload' && !(item instanceof ByteCollection)) {
      newParams[field] = ByteCollection.fromString(item).toHex();
    } else if (field === 'max' || field === 'start' || field === 'end' || field === 'depth') {
      newParams[field] = parseInt(item, 10);
    } else if (field === 'fee' && !(params[field] instanceof Currency)) {
      newParams[field] = parseFloat(new Currency(item).toString());
    } else if (field === 'amount' && !(params[field] instanceof Currency)) {
      newParams[field] = parseFloat(new Currency(item).toString());
    } else if (field === 'price' && !(params[field] instanceof Currency)) {
      newParams[field] = parseFloat(new Currency(item).toString());
    } else if (typeof item === 'boolean') {
      newParams[field] = item;
    } else if (item instanceof ByteCollection) {
      newParams[field] = item.toHex();
    } else if (item instanceof OperationHash) {
      newParams[field] = item.encode().toHex();
    } else if (item instanceof Account) {
      newParams[field] = item.account.account; // NICE!!!!! :-D
    } else if (item instanceof AccountNumber) {
      newParams[field] = item.account;
    } else if (item instanceof Block) {
      newParams[field] = item.block;
    } else if (item instanceof Currency) {
      newParams[field] = parseFloat(item.toString());
    } else if (typeof item === 'number') {
      newParams[field] = item;
    } else {
      newParams[field] = item.toString();
    }
  });

  return newParams;
}

/**
 * This class will execute an rpc call and returns a promise.
 */
class Executor {
  /**
     * Constructor
     *
     * @param {Caller} caller
     * @param {Number} concurrency
     */
  constructor(caller, concurrency = 1) {
    this[P_CALLER] = caller;
    this[P_QUEUE] = new PQueue({ concurrency });
  }

  /**
   * Calls the given method with the given params and returns a promise that
   * itself will transform the returned value and resolve the promise.
   *
   * @param {String} method
   * @param {Object} params
   * @param {Function} transformCallback
   * @returns {Promise<any>}
   */
  async execute(method, params, transformCallback = r => r) {
    return new Promise((resolve, reject) => {
      this[P_QUEUE].add(() => this[P_CALLER].call(method, transformRpcParams(params)))
        .then(response => resolve(transformCallback(response)))
        .catch(error => reject(error));
    });
  }

  /**
   * Calls the given method with the given params and returns a promise that
   * itself will transform the returned value and resolve the promise.
   *
   * @param {String} method
   * @param {Object} params
   * @param {Function} transformCallback
   * @returns {Promise<any>}
   */
  async executeAll(action, transformCallback = r => r) {
    const all = [];
    let result = [];
    do {
      result = await this.execute(action.method, action.params, transformCallback);
      result.forEach(item => all.push(item));
      action.changeParam('start', action.params.start + action.params.max);
    } while (result.length > 0 && result.length === action.params.max);

    return all;
  }

  /**
     * Calls the rpc method with the given parameters and returns a promise that
     * resolves with an array of objects of the given Destination type.
     *
     * @param {String} method
     * @param {Object} params
     * @param {*} DestinationType
     * @returns {Promise<any>}
     */
  async executeTransformArray(method, params, DestinationType) {
    return this.execute(method, params, r => r.map(ri => new DestinationType(ri)));
  }

  /**
     * Calls the rpc method with the given parameters and returns a promise that
     * resolves with an object of the given Destination type.
     *
     * @param {String} method
     * @param {Object} params
     * @param {*} DestinationType
     * @returns {Promise<any>}
     */
  async executeTransformItem(method, params, DestinationType) {
    return this.execute(method, params, r => new DestinationType(r));
  }
}

module.exports = Executor;

const OperationsBuilder = require('./Operation/OperationsBuilder');
const PrivateKey = require('./Keys/PrivateKey');
const KeyPair = require('./Keys/KeyPair');
const Curve = require('./Keys/Curve');
const RPC = require('./RPC/Client');

const Transaction = require('./Operation/Transaction');
const ChangeAccountInfo = require('./Operation/ChangeAccountInfo');

/**
 * A simple to use wrapper for all functionality related to
 */
class Wallet {

  constructor(rpcHostAddress) {
    this.rpc = RPC.factory(rpcHostAddress);
  }

  /**
     * Loads a key.
     *
     * @param {String} ident
     * @param {String} password
     */
  identify(ident, password) {
    const pkDecrypted = PrivateKey.decrypt(password, ident);

    if (pkDecrypted === false) {
      return false;
    }
    this.keyPair = KeyPair.fromPrivateKey(PrivateKey.decrypt(password, ident));
    return true;
  }

  /**
     * This function will generate a new secp256k1 keypair and return the
     * encrypted private key.
     *
     * @param {String} password
     * @returns {String}
     */
  generate(password) {
    this.keyPair = KeyPair.generate(new Curve(Curve.SECP256K1));
    return this.keyPair.privateKey.encrypt(password).toHex();
  }

  /**
     * Gets the list of all accounts of the current public key.
     *
     * @returns {Promise<any>}
     */
  getAccounts() {
    return this.rpc.findaccounts(null, null, 0, 100, null, null, null, this.keyPair.publicKey);
  }

  /**
     * Sends a transaction from sender to the target.
     *
     * @param {Number} sender
     * @param {Number} target
     * @param {String} amount
     * @param {String} payload
     */
  send(sender, target, amount) {
    return new Promise((resolve, reject) => {
      this.rpc.getaccount(sender).then((senderAccount) => {
        const opBuilder = new OperationsBuilder();
        const op = new Transaction(sender, target, amount);

        op.withPayload(payload);
        op.sign(this.keyPair, senderAccount.nOperation + 1);
        opBuilder.addOperation(op);
        this.rpc.executeoperations(opBuilder.build())
          .then(r => resolve(r))
          .catch(e => reject(e));
      });
    });
  }

  changeAccountInfo(signer, target, newName = null, newType = null, newPublicKey = null, payload) {
    return new Promise((resolve, reject) => {
      this.rpc.getaccount(target).then((targetAccount) => {
        const opBuilder = new OperationsBuilder();
        const op = new ChangeAccountInfo(signer, target);

        op.withPayload(payload);
        if (newName !== null) {
          op.withNewName(newName);
        }
        if (newType !== null) {
          op.withNewType(newType);
        }
        if (newPublicKey !== null) {
          op.withNewPublicKey(newPublicKey);
        }
        op.sign(this.keyPair, targetAccount.nOperation + 1);
        opBuilder.addOperation(op);
        this.rpc.executeoperations(opBuilder.build())
          .then(r => resolve(r))
          .catch(e => reject(e));
      });
    });
  }

  /**
     * Gets all saved keys.
     *
     * @returns {Array}
     */
  getKeys() {
    let keys = localStorage.getItem('keys');

    if (keys === null) {
      keys = [];
      localStorage.setItem('keys', JSON.stringify(keys));
      return this.getSavedKeys();
    }

    return JSON.parse(keys);
  }

  /**
     * Saves the given key with additional infos.
     *
     * @param {ByteCollection} encPrivateKey
     * @param {String} name
     * @param {array} accountNumbers
     */
  saveKey(encPrivateKey, name, accountNumbers) {
    const keys = this.getKeys();
    const idx = keys.findIndex(inst => inst.enc === encPrivateKey);
    const item = {
      enc: encPrivateKey,
      acc: Array.isArray(accountNumbers) ? accountNumbers.slice(0, 5) : [],
      name,
      ct: accountNumbers.length
    };

    if (idx === -1) {
      keys.push(item);
    } else {
      keys[idx] = item;
    }

    localStorage.setItem('keys', JSON.stringify(keys));
  }
}

module.exports = Wallet;

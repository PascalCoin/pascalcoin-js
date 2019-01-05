const ByteCollection = require('./../ByteCollection');

const P_OPERATIONS = Symbol('operations');

class OperationsBuilder {
  constructor() {
    this[P_OPERATIONS] = [];
  }

  addOperation(operation) {
    if (!operation.isSigned) {
      throw new Error('Operation needs to be signed.');
    }

    this[P_OPERATIONS].push(operation);
    return this;
  }

  build() {
    let bc = ByteCollection.fromInt(this[P_OPERATIONS].length, 4).switchEndian();
    this[P_OPERATIONS].forEach((op) => {
      bc = ByteCollection.concat(bc, op.toRaw());
    });

    return bc;
  }
}

module.exports = OperationsBuilder;

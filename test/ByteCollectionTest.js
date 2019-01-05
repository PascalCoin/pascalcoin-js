const assert = require('assert');
const ByteCollection = require('../src/ByteCollection');

describe('Pascal', () => {
  describe('ByteCollection', () => {
    it('can be statically create from a hex string', () => {
      const hexString = '02CA';
      assert.strictEqual(ByteCollection.fromHex(hexString).toHex(), hexString);
    });
    it('can be statically created from an int', () => {
      const val = 714;
      assert.strictEqual(ByteCollection.fromInt(val).toHex(), '02CA');
    });
    it('will append a leading 0 in case of mod 2 == 1', () => {
      const hexString = '2CA';
      assert.strictEqual(ByteCollection.fromHex(hexString).toHex(), `0${hexString}`);
    });
    it('will return the length of the bytes', () => {
      const hexString = 'ABABABABAB';
      assert.strictEqual(ByteCollection.fromHex(hexString).length, 5);
    });
    it('will return the length of the resulting hexastring', () => {
      const hexString = 'ABABABABAB';
      assert.strictEqual(ByteCollection.fromHex(hexString).hexLength, 10);
    });
    it('can switch endianness', () => {
      const hexString = 'CA20';
      assert.strictEqual(ByteCollection.fromHex(hexString).switchEndian().toHex(), '20CA');
      assert.strictEqual(ByteCollection.fromHex(hexString).switchEndian().switchEndian().toHex(), hexString);
    });
    it('can concat one or more hexastrings', () => {
      const hexas = ['ABCD', '0020', 'FFFFFFDD'].map(hex => ByteCollection.fromHex(hex));
      assert.strictEqual(ByteCollection.concat(...hexas).toHex(), 'ABCD0020FFFFFFDD');
    });
    it('can append a hexastring to an existing hexastring', () => {
      const base = ByteCollection.fromHex('ABCD');
      const append = ByteCollection.fromHex('DCBA');
      assert.strictEqual(base.append(append).toHex(), 'ABCDDCBA');
    });
    it('prepend append a hexastring to an existing hexastring', () => {
      const base = ByteCollection.fromHex('ABCD');
      const prepend = ByteCollection.fromHex('DCBA');
      assert.strictEqual(base.prepend(prepend).toHex(), 'DCBAABCD');
    });
    it('can slice parts', () => {
      const base = ByteCollection.fromHex('0123456789ABCDEF');
      const firstTwo = base.slice(0, 2);
      const midTwo = base.slice(4, 6);
      const lastTwo = base.slice(7);
      assert.strictEqual(firstTwo.toHex(), '0123');
      assert.strictEqual(midTwo.toHex(), '89AB');
      assert.strictEqual(lastTwo.toHex(), 'EF');
    });
    it('can return the results as a string', () => {
      const h = ByteCollection.fromString('Hello Techworker');
      assert.strictEqual(h.toString(), 'Hello Techworker');
    });
    it('can return the results as an int', () => {
      const h = ByteCollection.fromInt(714);
      assert.strictEqual(h.toInt(), 714);
    });
    it('can return the results as hex', () => {
      const h = ByteCollection.fromHex('ABCD');
      assert.strictEqual(h.toHex(), 'ABCD');
    });
  });
});

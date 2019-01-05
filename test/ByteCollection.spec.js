const chai = require('chai');
const ByteCollection = require('../src/ByteCollection');

chai.expect();
const expect = chai.expect;

describe('Pascal', () => {
  describe('ByteCollection', () => {
    it('can be statically create from a hex string', () => {
      const hexString = '02CA';
      expect(ByteCollection.fromHex(hexString).toHex()).to.be.equal(hexString);
    });
    it('can be statically created from an int', () => {
      const val = 714;
      expect(ByteCollection.fromInt(val).toHex()).to.be.equal('02CA');
    });
    it('will append a leading 0 in case of mod 2 == 1', () => {
      const hexString = '2CA';
      expect(ByteCollection.fromHex(hexString).toHex()).to.be.equal(`0${hexString}`);
    });
    it('will return the length of the bytes', () => {
      const hexString = 'ABABABABAB';
      expect(ByteCollection.fromHex(hexString).length).to.be.equal(5);
    });
    it('will return the length of the resulting hexastring', () => {
      const hexString = 'ABABABABAB';
      expect(ByteCollection.fromHex(hexString).hexLength).to.be.equal( 10);
    });
    it('can switch endianness', () => {
      const hexString = 'CA20';
      expect(ByteCollection.fromHex(hexString).switchEndian().toHex()).to.be.equal('20CA');
      expect(ByteCollection.fromHex(hexString).switchEndian().switchEndian().toHex()).to.be.equal(hexString);
    });
    it('can concat one or more hexastrings', () => {
      const hexas = ['ABCD', '0020', 'FFFFFFDD'].map(hex => ByteCollection.fromHex(hex));
      expect(ByteCollection.concat(...hexas).toHex()).to.be.equal('ABCD0020FFFFFFDD');
    });
    it('can append a hexastring to an existing hexastring', () => {
      const base = ByteCollection.fromHex('ABCD');
      const append = ByteCollection.fromHex('DCBA');
      expect(base.append(append).toHex()).to.be.equal('ABCDDCBA');
    });
    it('prepend append a hexastring to an existing hexastring', () => {
      const base = ByteCollection.fromHex('ABCD');
      const prepend = ByteCollection.fromHex('DCBA');
      expect(base.prepend(prepend).toHex()).to.be.equal('DCBAABCD');
    });
    it('can slice parts', () => {
      const base = ByteCollection.fromHex('0123456789ABCDEF');
      const firstTwo = base.slice(0, 2);
      const midTwo = base.slice(4, 6);
      const lastTwo = base.slice(7);
      expect(firstTwo.toHex()).to.be.equal('0123');
      expect(midTwo.toHex()).to.be.equal('89AB');
      expect(lastTwo.toHex()).to.be.equal('EF');
    });
    it('can return the results as a string', () => {
      const h = ByteCollection.fromString('Hello Techworker');
      expect(h.toString()).to.be.equal('Hello Techworker');
    });
    it('can return the results as an int', () => {
      const h = ByteCollection.fromInt(714);
      expect(h.toInt()).to.be.equal(714);
    });
    it('can return the results as hex', () => {
      const h = ByteCollection.fromHex('ABCD');
      expect(h.toHex()).to.be.equal('ABCD');
    });
  });
});

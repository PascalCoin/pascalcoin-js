/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const BaseAction = require('./BaseAction');

/**
 * Whenever a remote endpoint has paging possibilities, this action will be
 * returned.
 */
class PagedAction extends BaseAction {
  /**
     * Constructor.
     *
     * @param {String} method
     * @param {Object} params
     * @param {Executor} executor
     */
  constructor(method, params, executor) {
    super(method, params, executor);
    this.changeParam('start', 0);
    this.changeParam('max', 100);
  }

  set start(start) {
    this.changeParam('start', start);
    return this;
  }

  set max(max) {
    this.changeParam('max', max);
    return this;
  }

  /**
   * Executes the current action and returns the raw result.
   *
   * @returns {Promise}
   */
  async executeAll() {
    const all = [];
    let result = [];
    do {
      result = await this.execute();
      result.forEach(item => all.push(item));
      this.changeParam('start', this.params.start + this.params.max);
    } while (result.length > 0 && result.length === this.params.max);

    return all;
  }

  /**
   * Executes the current action and transforms the result to an array
   *  of the defined type.
   *
   *  @param {Object} DestinationType
   * @returns {Promise}
   */
  async executeAllTransformArray(DestinationType) {
    const all = [];
    let result = [];
    do {
      result = await this.executeTransformArray(DestinationType);
      result.forEach(item => all.push(item));
      this.changeParam('start', this.params.start + this.params.max);
    } while (result.length > 0 && result.length === this.params.max);

    return all;
  }

  /**
     * Gets a flag indicating whether the current action is valid.
     *
     * @returns {boolean}
     */
  isValid() {
    return true;
  }
}

module.exports = PagedAction;

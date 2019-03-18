'use strict';

const { JDateRepository } = require('@behaver/jdate');

/**
 * CalculatorCommon
 * 
 * CalculatorCommon 是计算组件公共继承类，其中声明了计算类的公共方法。
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class CalculatorCommon {

  /**
   * 构造函数
   * 
   * @param  {JDateRepository} epoch 目标历元对象
   */
  constructor(epoch) {
    // 初始化私有变量空间
    this.private = {};

    this.epoch = epoch;
  }

  /**
   * 设置目标历元对象
   * 
   * @param {JDateRepository} value 目标历元对象
   */
  set epoch(value) {
    // 参数检验
    if (!(value instanceof JDateRepository)) throw Error('The param value should be an instance of JDateRepository.');
  
    this.private.epoch = value;
  }

  /**
   * 获取目标历元对象
   * 
   * @return {JDateRepository} 目标历元对象
   */
  get epoch() {
    return this.private.epoch;
  }
}

module.exports = CalculatorCommon;

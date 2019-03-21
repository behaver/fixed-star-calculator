'use strict';

const CalculatorCommon = require('./CalculatorCommon');
const AnnualParallax = require('@behaver/annual-parallax');
const { SphericalCoordinate3D } = require('@behaver/coordinate');
const Angle = require('@behaver/angle');
const angle = new Angle;

/**
 * DynamicCalculator
 *
 * DynamicCalculator 是一个使用动力学方法计算恒星位置的计算器组件
 * 本方法计算结果完成恒星自行和周年视差修正
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class DynamicCalculator extends CalculatorCommon {

  /**
   * 计算恒星 Date 赤道坐标
   * 
   * @param  {Number} options.RA       J2000 平赤经，单位：°
   * @param  {Number} options.Dec      J2000 平赤纬，单位：°
   * @param  {Number} options.PMRA     赤经自行，单位：角秒每儒略年
   * @param  {Number} options.PMDec    赤纬自行，单位：角秒每儒略年
   * @param  {Number} options.radVel   日心视向速度，单位：km/s
   * @param  {Number} options.parallax 周年视差，单位：角秒

   * @return {Object}                  恒星 Date 赤道坐标对象
   */
  calc({
    RA,
    Dec,
    PMRA,
    PMDec,
    radVel,
    parallax,
  }) {
    // radVel 缺省值处理
    if (radVel === undefined) radVel = 0;

    // 时间差度，单位：儒略年
    let d = this.private.epoch.JDEC * 100;

    let RA_s = angle.setDegrees(RA).getSeconds(),
        Dec_s = angle.setDegrees(Dec).getSeconds();

    /* 日心距离处理 */

    // 转换周年视差角度为弧度
    parallax = angle.setSeconds(parallax).getRadian();
    // 计算日心距离
    let Radius = 1 / parallax;

    /* 自行差处理 */

    // 赤经自行角度，单位：角秒
    let deltaRA = PMRA * d;
    // 赤纬自行角度，单位：角秒
    let deltaDec = PMDec * d;

    /* 视向差处理 */

    // 一天文单位的千米数
    let KMPerAU = 149597870;
    // 转换视向速度单位为 AU/d
    radVel = radVel * 86400 / KMPerAU;
    // 恒星日心自行距离差，单位：AU
    let deltaRadius = radVel * d * 365.25;

    let sc = new SphericalCoordinate3D(
      Radius + deltaRadius,
      angle.setSeconds(324000 - Dec_s - deltaDec).inRound(-180, 'd').getRadian(),
      angle.setSeconds(RA_s + deltaRA).inRound().getRadian()
    );

    /* 周年视差处理 */

    let AP = new AnnualParallax({
      time: this.private.epoch,
      sc: sc,
    });

    let apRes = AP.get();

    sc.from(
      sc.r,
      angle.setRadian(sc.theta + apRes.a).inRound(-180, 'd').getRadian(),
      angle.setRadian(sc.phi + apRes.b).inRound().getRadian()
    );

    return sc;
  }
}

module.exports = DynamicCalculator;

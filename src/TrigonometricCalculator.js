'use strict';

const CalculatorCommon = require('./CalculatorCommon');
const { EarthHECC } = require('@behaver/solar-planets-hecc');
const { SystemSwitcher3D, SphericalCoordinate3D } = require('@behaver/coordinate');
const Angle = require('@behaver/angle');
const angle = new Angle;

/**
 * TrigonometricCalculator
 *
 * TrigonometricCalculator 是一个使用三角学方法计算恒星位置的计算器组件
 * 本方法计算结果完成恒星自行和周年视差修正
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class TrigonometricCalculator extends CalculatorCommon {

  /**
   * 计算恒星 Date 赤道坐标
   * 
   * @param  {Number} options.RA       J2000 平赤经
   * @param  {Number} options.Dec      J2000 平赤纬
   * @param  {Number} options.PMRA     赤经周年自行，单位：角秒每儒略年
   * @param  {Number} options.PMDec    赤纬周年自行，单位：角秒每儒略年
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
    // 一天文单位的千米数
    let KMPerAU = 149597870;

    // 时间差度，单位：儒略年
    let d = this.private.epoch.JDEC * 100;

    /* 赤经、赤纬处理 */

    let RA_r = angle.setDegrees(RA).getRadian(),
        Dec_r = angle.setDegrees(Dec).getRadian();

    // 三角函数处理
    let cosRA = Math.cos(RA_r),
        sinRA = Math.sin(RA_r),
        cosDec = Math.cos(Dec_r),
        sinDec = Math.sin(Dec_r);

    /* 日心距离处理 */

    // 计算日心距离
    let Rad = 1 / angle.setSeconds(parallax).getRadian();

    /* 自行速度处理 */

    // 将赤经自行，赤纬自行，视向速度的单位转化为: AU/d
    let vRA = PMRA / 36525 / parallax,
        vDec = PMDec / 36525 / parallax,
        vRad = 86400 * radVel / KMPerAU;

    let cDsR = cosDec * sinRA,
        sDcR = sinDec * cosRA,
        cDcR = cosDec * cosRA,
        sDsR = sinDec * sinRA;

    // 恒星空间速度 V , 单位：AU/d
    let V = [
      - cDsR * vRA - sDcR * vDec + cDcR * vRad,
      cDcR * vRA - sDsR * vDec + cDsR * vRad,
      cosDec * vDec + sinDec * vRad,
    ];

    /* 地球日心位置处理 */

    let Earth = new EarthHECC(this.private.epoch);
    let R = Earth.sc.toRC();

    // 计算公式：
    // r1S1 = r0 + V * t - R
    let r1S1 = [
      Rad * cDcR + V[0] * d - R.x,
      Rad * cDsR + V[1] * d - R.y,
      Rad * sinDec + V[2] * d - R.z,
    ];

    let SS = new SystemSwitcher3D(
      r1S1[0],
      r1S1[1],
      r1S1[2],
      'rc'
    );

    let sc = SS.toSC();

    return new SphericalCoordinate3D(
      sc.r,
      sc.theta,
      sc.phi
    );
  }
}

module.exports = TrigonometricCalculator;

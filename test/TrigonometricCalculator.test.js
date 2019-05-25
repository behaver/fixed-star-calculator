'use strict';

const expect = require("chai").expect;
const TrigonometricCalculator = require('../src/TrigonometricCalculator');
const { JDateRepository } = require('@behaver/jdate');
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');
const Angle = require('@behaver/angle');
const angle = new Angle;

describe('#index', () => {
  describe('Verify', () => {
    it('恒星 θPersei 赤道坐标计算，参照《天文算法》', () => {
      let jdate = new JDateRepository(2462088.69, 'jde');

      expect(jdate.JDEC).to.closeTo(0.288670500, 1e-9);

      let FS = new TrigonometricCalculator(jdate);

      let res1 = FS.calc({
        RA: 41.0500,
        Dec: 49.2283,
        PMRA: 0.336,
        PMDec: -0.089,
        radVel: 25,
        parallax: 0.089,
      });

      let ec1 = new EquinoctialCoordinate({
        sc: res1,
        withAnnualAberration: false,
        withNutation: false,
      });

      // 修正岁差
      ec1.epoch = FS.epoch;

      // 修正光行差
      ec1.withAnnualAberration = true;

      // 修正章动
      ec1.withNutation = true;

      expect(ec1.ra.getDegrees()).to.closeTo(41.5599646, 0.005);
      expect(ec1.dec.getDegrees()).to.closeTo(49.3520685, 0.001);
    });

    it('仙女座α星', () => {
      let date = new Date('2018/06/25');
      date.setFullYear(-2200);

      let jdate = new JDateRepository(date, 'date');

      let Calculator = new TrigonometricCalculator(jdate);

      let sc = Calculator.calc({
        RA: angle.parseHACString('00h 08m 23.2586s').getDegrees(),
        Dec: angle.parseDACString('29°05′25.555″').getDegrees(),
        PMRA: 0.13568,
        PMDec: -0.16295,
        radVel: -10.6,
        parallax: 0.03360,
      });

      let eqc = new EquinoctialCoordinate({
        sc,
        withAnnualAberration: false,
        withNutation: false,
      });

      // 修正岁差
      eqc.epoch = Calculator.epoch;

      // 修正光行差
      eqc.withAnnualAberration = true;

      // 修正章动
      eqc.withNutation = true;

      expect(eqc.ra.getDegrees()).to.closeTo(311.2155, 0.2);
      expect(eqc.dec.getDegrees()).to.closeTo(8.393648, 0.3);
    });
  })
});
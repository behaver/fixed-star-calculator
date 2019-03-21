# FixedStarCalculator
[![GitHub license](https://img.shields.io/badge/license-ISC-brightgreen.svg)](#) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/@behaver/fixed-star-calculator) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

## 简介

FixedStarCalculator 是一个用以计算恒星赤道坐标的天文学组件。它包含有动力学计算子组件 `DynamicCalculator` 和三角学计算子组件 `TrigonometricCalculator`。

## 安装

通过 npm 安装，在你的 node 项目目录下执行：

`npm install @behaver/fixed-star-calculator`

安装完成后，调用即可：

`const { DynamicCalculator } = require('@behaver/fixed-star-calculator');`

## 用例

```js
const { DynamicCalculator } = require('@behaver/fixed-star-calculator');
const { JDateRepository } = require('@behaver/jdate');
const { EquinoctialCoordinate } = require('@behaver/celestial-coordinate');

// 实例化儒略时间对象
let jdate = new JDateRepository(2462088.69, 'jde');

// 实例化恒星坐标计算组件
let Calculator = new DynamicCalculator(jdate);
// let Calculator = new TrigonometricCalculator(jdate);

// 计算恒星修正自行和周年视差后的球坐标
let sc = Calculator.calc({
  RA: 41.0500,
  Dec: 49.2283,
  PMRA: 0.336,
  PMDec: -0.089,
  radVel: 25,
  parallax: 0.089,
});

// 实例化赤道坐标组件
let eqc = new EquinoctialCoordinate({
  sc,
});

// 修正岁差
eqc.epoch = Calculator.epoch;

// 修正光行差
eqc.withAnnualAberration = true;

// 修正章动
eqc.withNutation = true;

// 输出赤经度数
console.log(eqc.ra.getDegrees());

// 输出赤纬度数
console.log(eqc.dec.getDegrees());

// 输出赤地心距
console.log(eqc.radius);
```

## API

`constructor(epoch)`

构造函数

* epoch 目标历元 JDateRepository 对象

`set epoch(value)`

设置目标历元对象

* epoch 目标历元 JDateRepository 对象

`get epoch()`

获取目标历元对象

`calc(options)`

计算恒星赤道坐标（修正了自行和周年视差）

* options.RA       J2000 平赤经
* options.Dec      J2000 平赤纬
* options.PMRA     赤经周年自行，单位：角秒每儒略年
* options.PMDec    赤纬周年自行，单位：角秒每儒略年
* options.radVel   日心视向速度，单位：km/s
* options.parallax 周年视差，单位：角秒

## 许可证书

The ISC license.
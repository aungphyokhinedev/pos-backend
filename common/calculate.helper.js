"use strict";

const  calculateCharge =  (amount, charge) => {
    const _flatRate = charge ? charge.flatRate : 0;
    const _percentage = charge ? charge.percentage : 0;
    const _percentageRate = _percentage > 0 ? amount * (_percentage / 100) : 0;
    const _totalRate = _flatRate + _percentageRate;
   
    return {
        flatRate: _flatRate,
        percentageRate: _percentageRate,
        totalRate : _totalRate,
        totalAmount: amount  - _totalRate,
    };

};

module.exports = {calculateCharge};
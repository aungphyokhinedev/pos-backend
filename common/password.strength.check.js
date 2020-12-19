"use strict";

const  check =  (password) => {
    if(password.length < 6)
        throw "Password must have minimun 6 characters";
    if(!/\d/.test(password))
        throw "Password must have at least one digit";
    if(!/[a-z]/.test(password))
        throw "Password must have at least one lower case character";
    if(!/[A-Z]/.test(password))
        throw "Password must have at least one upper case character";
    return true;
};

module.exports = {check};
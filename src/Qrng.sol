// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {console} from "forge-std/Console.sol";
import {RrpRequesterV0} from "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

///  @title Contract that represents a game of dice poker
///  @author Munanadi - Beginner
///  @notice Contract that will represent a game of dice poker on chain
///  @dev This will be the state of a contract rep all hands of the players
contract Qrng is RrpRequesterV0 {
    /// The address of the QRNG Airnode
    address public airnode;
    /// The endpoint ID for requesting an array of random numbers
    bytes32 public endpointIdUint256Array;
    /// The wallet that will cover the gas costs of the request
    address public sponsorWallet;
    /// The array of random numbers returned by the QRNG Airnode
    uint256[] public _qrngUint256Array;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address airNodeAddress) RrpRequesterV0(airNodeAddress) {}

    /// @notice Sets the parameters for making requests
    function setRequestParameters(address _airnode, bytes32 _endpointIdUint256Array, address _sponsorWallet) external {
        airnode = _airnode;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    /// @notice To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(address(this)).transfer(msg.value);
    }

    /// @notice Requests a `uint256[]`
    /// @param size Size of the requested array
    function makeRequestUint256Array(uint256 size) external returns (bytes32) {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256Array.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        return requestId;
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256Array(bytes32 requestId, bytes calldata data) external onlyAirnodeRrp {
        require(expectingRequestWithIdToBeFulfilled[requestId], "Request ID not known");
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256[] memory qrngUint256Array = abi.decode(data, (uint256[]));
        // Do what you want with `qrngUint256Array` here...
        _qrngUint256Array = qrngUint256Array;
    }
}

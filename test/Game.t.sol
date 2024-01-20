// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console2} from "forge-std/Test.sol";
import {Game} from "../src/Game.sol";

contract GameTest is Test {
    Game public game;
    uint256 NUMBER_OF_PLAYERS = 5;

    function setUp() public {
        game = new Game(NUMBER_OF_PLAYERS);
    }

    function test_MaxNumberOfPlayers() public {
        assertEq(game.getTotalNumberOfPlayers(), NUMBER_OF_PLAYERS);
    }
}

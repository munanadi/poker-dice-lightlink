// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Test, console} from "forge-std/Test.sol";
import {Game} from "../src/Game.sol";
import {SortLib} from "../src/library/SortLib.sol";

uint256 constant NUMBER_OF_PLAYERS = 5;
uint256 constant NUMBER_OF_DICE_ROLLS = 5;

// contract ChildGame is Game {
    // constructor() Game(NUMBER_OF_PLAYERS) {}

    // function exposed_rollDice(uint256 _numberOfDiceToRoll) external view returns (uint256[] memory) {
    //     return Game._rollDice(_numberOfDiceToRoll);
    // }
// }

// contract GameTest is Test {
    // ChildGame public game;

    // address alice = vm.addr(1);
    // address bob = vm.addr(2);

    // function setUp() public {
    //     // Alice sets up the game
    //     vm.prank(alice);
    //     game = new ChildGame();
    // }

    // function test__rollDice() public {
    //     uint256[] memory returnData = game.exposed_rollDice(NUMBER_OF_DICE_ROLLS);

    //     for (uint256 i = 0; i < NUMBER_OF_DICE_ROLLS; i++) {
    //         assertLt(returnData[i], 6);
    //         assertGe(returnData[i], 0);
    //     }
    // }

    // // Testing SortLib
    // using SortLib for uint256[];

    // function test_sortLibForArr() public {
    //     uint256[] memory array = new uint256[](3);
    //     array[0] = 100;
    //     array[1] = 1000;
    //     array[2] = 10;
    //     array.sort();
    //     assertEq(array[0], 10);
    //     assertEq(array[1], 100);
    //     assertEq(array[2], 1000);
    // }
// }

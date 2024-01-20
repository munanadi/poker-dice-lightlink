// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Game} from "../src/Game.sol";

contract GameTest is Test {
    Game public game;
    uint256 NUMBER_OF_PLAYERS = 5;

    address alice = vm.addr(1);
    address bob = vm.addr(2);

    function setUp() public {
        // Alice sets up the game
        vm.prank(alice);
        game = new Game(NUMBER_OF_PLAYERS);
    }

    function test_MaxNumberOfPlayers() public {
        assertEq(game.getTotalNumberOfPlayers(), NUMBER_OF_PLAYERS);
    }

    function test_aliceJoinsGame() public {
        vm.deal(alice, 1e18);

        // 0.001 ETH
        uint256 entryFee = 0.001 ether;

        game.joinGame{value: entryFee}(alice);

        assertEq(game.getCurrentCountOfPlayers(), 1);
        assertEq(game.getTotalPrizePool(), entryFee);
    }

    function test_aliecAndBobJoinGame() public {
        vm.deal(bob, 1e18);
        vm.deal(alice, 1e18);

        // 0.001 ETH
        uint256 entryFee = 0.001 ether;

        game.joinGame{value: entryFee}(bob);
        game.joinGame{value: entryFee}(alice);

        assertEq(game.getCurrentCountOfPlayers(), 2);
        assertEq(game.getTotalPrizePool(), 2 * entryFee);
    }
}

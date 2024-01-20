// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Game} from "../src/Game.sol";

contract GameTest is Test {
    Game public game;
    uint256 NUMBER_OF_PLAYERS = 5;
    // 0.001 ETH
    uint256 constant ENTRY_FEE = 0.001 ether;

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

        game.joinGame{value: ENTRY_FEE}(alice);

        assertEq(game.getCurrentCountOfPlayers(), 1);
        assertEq(game.getTotalPrizePool(), ENTRY_FEE);
    }

    function test_aliecAndBobJoinGame() public {
        vm.deal(bob, 1e18);
        vm.deal(alice, 1e18);

        game.joinGame{value: ENTRY_FEE}(bob);
        game.joinGame{value: ENTRY_FEE}(alice);

        assertEq(game.getCurrentCountOfPlayers(), 2);
        assertEq(game.getTotalPrizePool(), 2 * ENTRY_FEE);
    }

    function test_maxPlayersJoining() public {
        for (uint256 i = 0; i < NUMBER_OF_PLAYERS; i++) {
            vm.deal(vm.addr(i + 10), 1e18);
            game.joinGame{value: ENTRY_FEE}(vm.addr(i + 10));
        }

        vm.expectRevert();
        game.joinGame{value: ENTRY_FEE}(vm.addr(20));
    }

    function test_playersCannotJoinWithoutEntryFee() public {
        vm.expectRevert();
        game.joinGame{value: 0 ether}(bob);
    }

    function test_playerBets() public {
        vm.deal(alice, 1e18);

        game.joinGame{value: ENTRY_FEE}(alice);

        // Increase the bet for Alice
        game.changeBet(0, 0.002 ether, true);
        assertEq(game.getCurrentBetForPlayer(0), 0.002 ether + ENTRY_FEE);

        // Decrease the bet for Alice
        game.changeBet(0, 0.001 ether, false);
        assertEq(game.getCurrentBetForPlayer(0), 0.001 ether + ENTRY_FEE);
    }

    function test_gameStateTransitions() public {
        // WaitingOnPlayersToJoin state
        assertEq(uint256(game.getGameState()), 0);

        // Five players join the game
        vm.deal(alice, 1e18);
        game.joinGame{value: ENTRY_FEE}(alice);
        vm.deal(bob, 1e18);
        game.joinGame{value: ENTRY_FEE}(bob);
        vm.deal(vm.addr(10), 1e18);
        game.joinGame{value: ENTRY_FEE}(vm.addr(10));
        vm.deal(vm.addr(11), 1e18);
        game.joinGame{value: ENTRY_FEE}(vm.addr(11));
        vm.deal(vm.addr(12), 1e18);
        game.joinGame{value: ENTRY_FEE}(vm.addr(12));

        // WaitingOnPlayerTurn state
        assertEq(uint256(game.getGameState()), 1);
    }
}

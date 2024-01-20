// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {console} from "forge-std/Console.sol";

/**
 * @title Contract that represents a game of dice poker
 * @author Munanadi - Beginner
 * @notice Contract that will represent a game of dice poker on chain
 * @dev This will be the state of a contract rep all hands of the players
 */
contract Game {
    //-------- Errors
    error GameAtCapacity();
    error EntryFeeNotMet(uint256 _feeAmount);
    error PlayerIndexNotExist(uint256 _playerIndex);

    //-------- Events
    event GameStarted(uint256 indexed numberOfPlayers);
    event PlayerAdded(address indexed playerAddress);

    /**
     * These are 6 faces of a die denoted by integers.
     */
    enum Face {
        Ace,
        King,
        Queen,
        Jack,
        Ten,
        Nine
    }

    /**
     * These are the ranks that a hand can have in the end,
     * ordered from the highest to the lowest in points
     */
    enum Ranks {
        FiveOfAKind,
        FourOfAKind,
        FullHouse,
        Straight,
        ThreeOfAKind,
        TwoPair,
        Pair,
        Bust
    }

    /**
     * This will represent the various game states
     */
    enum GameState {
        WaitingOnPlayersToJoin,
        WaitingOnPlayerTurn,
        Started,
        Finished
    }

    /**
     * This is how a player would be represented in our game,
     * their name and the hand they have chosen
     */
    struct Player {
        // index of the player
        uint256 index;
        // hand chosen in the current round
        uint256[] hand;
        // bet placed
        uint256 bet;
    }

    // Number of max players in this game
    uint256 private s_totalNumberOfPlayers;
    // Number of players in this game currently
    uint256 private s_currentCountOfPlayers;
    // State of the respective players in the game
    mapping(uint256 index => Player player) private playerState;
    // Game state
    GameState public gameState;

    // TODO: Remove this constant value for a dynamic entry fee later
    uint256 public constant ENTRY_FEE = 0.001 ether;

    constructor(uint256 _numberOfPlayers) {
        // Setup the game
        s_totalNumberOfPlayers = _numberOfPlayers;
        emit GameStarted(s_totalNumberOfPlayers);
    }

    //-------- Functions
    /**
     * @dev This is called to join the game that was started
     * @param _playerAddress is the address of the player that wants to join the game
     */
    function joinGame(address _playerAddress) public payable {
        // Check if game is not full, else join.
        uint256 currentCount = s_currentCountOfPlayers;

        if (currentCount >= s_totalNumberOfPlayers) {
            revert GameAtCapacity();
        }

        // Check for entry fee
        if (msg.value < ENTRY_FEE) {
            revert EntryFeeNotMet(ENTRY_FEE);
        }

        // Add the player
        uint256[] memory startingHand = new uint256[](5);

        Player memory newPlayer = Player({index: currentCount, hand: startingHand, bet: msg.value});

        playerState[currentCount] = newPlayer;
        s_currentCountOfPlayers += 1;

        emit PlayerAdded(_playerAddress);
    }

    /**
     * @dev This is called to update a players roll (hand)
     * @param _numberOfDiceToRoll is the number of dice to roll
     * @return listOfDice is the dice rolls
     */
    function rollDice(uint256 _numberOfDiceToRoll) public returns (uint256[] memory listOfDice) {
        // TODO: This is where the rolled dice will be returned.
        // 3 should return 3 different random numbers between 0,6
    }

    /**
     * @dev this function will take index and delta in bet and udpate the player struct
     * @param _playerIndex is the index of the player in the mapping
     * @param _betDelta is the change in bet amount
     * @param _toAdd is a bool representing to add or remove from bet
     */
    function changeBet(uint256 _playerIndex, uint256 _betDelta, bool _toAdd) public {
        Player storage currentPlayer = playerState[_playerIndex];

        if (_toAdd) {
            currentPlayer.bet += _betDelta;
        } else {
            currentPlayer.bet -= _betDelta;
        }
    }

    //-------- Getters
    function getTotalNumberOfPlayers() public view returns (uint256) {
        return s_totalNumberOfPlayers;
    }

    function getCurrentCountOfPlayers() public view returns (uint256) {
        return s_currentCountOfPlayers;
    }

    /// This functionw will return the total bet by a player incluvsive of the entry fee
    function getCurrentBetForPlayer(uint256 _playerIndex) public view returns (uint256) {
        if (_playerIndex >= s_totalNumberOfPlayers) {
            revert PlayerIndexNotExist(_playerIndex);
        }
        return playerState[_playerIndex].bet;
    }

    function getTotalPrizePool() public view returns (uint256) {
        uint256 totalPrizePool;
        uint256 totalPlayersCount = s_totalNumberOfPlayers;

        for (uint256 i = 0; i < totalPlayersCount; i++) {
            totalPrizePool += playerState[i].bet;
        }

        return totalPrizePool;
    }
}

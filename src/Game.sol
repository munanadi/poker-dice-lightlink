// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {console} from "forge-std/Console.sol";
import {SortLib} from "./library/SortLib.sol";

/**
 * @title Contract that represents a game of dice poker
 * @author Munanadi - Beginner
 * @notice Contract that will represent a game of dice poker on chain
 * @dev This will be the state of a contract rep all hands of the players
 */
contract Game {
    using SortLib for uint256[];

    //-------- Errors
    error GameAtCapacity();
    error EntryFeeNotMet(uint256 feeAmount);
    error PlayerIndexNotExist(uint256 playerIndex);

    //-------- Events
    event GameStarted(uint256 indexed numberOfPlayers);
    event PlayerAdded(address indexed playerAddress);
    event PlayerPlayedRound(uint256 indexed playerIndex);

    /**
     * These are 6 faces of a die denoted by integers.
     */
    enum Face {
        // Discard the first value as deafult state
        Discard,
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

    enum PlayingState {
        WaitingTurn,
        DoneWithTurn
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
        // bet amount
        uint256 bet;
        // state player is in
        PlayingState state;
    }

    // Number of max players in this game
    uint256 private s_totalNumberOfPlayers;
    // Number of players in this game currently
    uint256 private s_currentCountOfPlayers;
    // State of the respective players in the game
    mapping(uint256 index => Player player) private playerState;
    // Game state
    GameState private s_gameState;

    // TODO: Remove this constant value for a dynamic entry fee later
    uint256 public constant ENTRY_FEE = 0.001 ether;

    constructor(uint256 _numberOfPlayers) {
        // Setup the game
        s_totalNumberOfPlayers = _numberOfPlayers;
        emit GameStarted(s_totalNumberOfPlayers);

        s_gameState = GameState.WaitingOnPlayersToJoin;
    }

    //-------- Functions
    /**
     * @dev This is called to join the game that was started
     * @param _playerAddress is the address of the player that wants to join the game
     */
    function joinGame(address _playerAddress) public payable {
        // Check if game is not full, else join.
        if (s_currentCountOfPlayers >= s_totalNumberOfPlayers) {
            revert GameAtCapacity();
        }

        // Check for entry fee
        if (msg.value < ENTRY_FEE) {
            revert EntryFeeNotMet(ENTRY_FEE);
        }

        // Add the player
        uint256[] memory startingHand = new uint256[](5);

        Player memory newPlayer = Player({
            index: s_currentCountOfPlayers,
            hand: startingHand,
            bet: msg.value,
            state: PlayingState.WaitingTurn
        });

        playerState[s_currentCountOfPlayers] = newPlayer;
        s_currentCountOfPlayers += 1;

        // Game state update, can start to play now
        if (s_currentCountOfPlayers == s_totalNumberOfPlayers) {
            s_gameState = GameState.WaitingOnPlayerTurn;
        }

        emit PlayerAdded(_playerAddress);
    }

    /**
     * @dev this function is called from the player, this will play a round lock in his hand, roll dice
     * @param _playerIndex is the index of the player
     * @param _indicesOfDice are the index of dice that are (re)rolled
     */
    function playRound(uint256 _playerIndex, uint256[] memory _indicesOfDice) external {
        // This will be called after the palyer has locked his bets
        // A player can choose not to re-roll any dice at a given point
        uint256[] memory listOfRandomDice;

        // It should call the _rollDice fn that will give new random values to the palyer
        uint256 numberOfDiceToRoll = _indicesOfDice.length;
        listOfRandomDice = _rollDice(numberOfDiceToRoll);

        // Update the player state to DoneWithTurn
        playerState[_playerIndex].state = PlayingState.DoneWithTurn;
        uint256[] storage playersHand = playerState[_playerIndex].hand;

        for (uint256 i = 0; i < numberOfDiceToRoll; i++) {
            uint256 indexToChange = _indicesOfDice[i];
            playersHand[indexToChange] = listOfRandomDice[i];
        }

        // Update the game state
        _updateGameState();
    }

    /**
     * @dev Internal function call that will update the game state
     */
    function _updateGameState() internal {
        uint256 totalPlayersCount = s_totalNumberOfPlayers;

        for (uint256 i = 0; i < totalPlayersCount; i++) {
            if (playerState[i].state != PlayingState.DoneWithTurn) {
                s_gameState = GameState.WaitingOnPlayerTurn;
                break;
            }
        }
    }

    /**
     * @dev Internal function call that procures the random numbers
     * @param _numberOfDiceToRoll is the number of dice to roll
     * @return listOfDice is the dice rolls
     */
    function _rollDice(uint256 _numberOfDiceToRoll) internal view returns (uint256[] memory listOfDice) {
        // TODO: Need to replace this with the actual random number generator.
        uint256[] memory randomValues = new uint256[](_numberOfDiceToRoll);

        for (uint256 i = 0; i < _numberOfDiceToRoll; i++) {
            uint256 randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, i)));
            randomValues[i] = randomSeed % 6;
        }

        return randomValues;
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

    function getGameState() public view returns (GameState) {
        return s_gameState;
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

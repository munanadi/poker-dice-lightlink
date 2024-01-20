// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

/**
 * @title Contract that represents a game of dice poker
 * @author Munanadi - Beginner
 * @notice Contract that will represent a game of dice poker on chain
 * @dev This will be the state of a contract rep all hands of the players
 */
contract Game {
    //-------- Errors
    error GameAtCapacity();

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
        WaitingOnPlayer,
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
    }

    // Number of max players in this game
    uint256 private s_totalNumberOfPlayers;
    // Number of players in this game currently
    uint256 private s_currentCountOfPlayers;
    // State of the respective players in the game
    mapping(uint256 index => Player player) private playerState;

    constructor(uint256 _numberOfPlayers) {
        s_totalNumberOfPlayers = _numberOfPlayers;

        emit GameStarted(s_totalNumberOfPlayers);
    }

    //-------- Functions
    /**
     * @dev This is called to join the game that was started
     * @param _playerAddress is the address of the player that wants to join the game
     */
    function joinGame(address _playerAddress) external {
        // Check if game is not full, else join.
        if (s_currentCountOfPlayers >= s_totalNumberOfPlayers) {
            revert GameAtCapacity();
        }

        uint256[] memory startingHand = new uint256[](5);
        Player memory newPlayer = Player({index: s_currentCountOfPlayers, hand: startingHand});

        playerState[s_currentCountOfPlayers] = newPlayer;

        emit PlayerAdded(_playerAddress);
    }

    //-------- Getters
    function getTotalNumberOfPlayers() public view returns (uint256) {
        return s_totalNumberOfPlayers;
    }

    function getCurrentCountOfPlayers() public view returns (uint256) {
        return s_currentCountOfPlayers;
    }
}

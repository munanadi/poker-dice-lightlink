// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {console} from "forge-std/Console.sol";
import {RrpRequesterV0} from "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import {SortLib} from "./library/SortLib.sol";

///  @title Contract that represents a game of dice poker
///  @author Munanadi - Beginner
///  @notice Contract that will represent a game of dice poker on chain
///  @dev This will be the state of a contract rep all hands of the players
contract Game is RrpRequesterV0 {
    //// RANDOM API3
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);
    event WithdrawalRequested(address indexed airnode, address indexed sponsorWallet);

    /// The address of the QRNG Airnode
    address public airnode;
    /// The endpoint ID for requesting a single random number
    bytes32 public endpointIdUint256;
    /// The endpoint ID for requesting an array of random numbers
    bytes32 public endpointIdUint256Array;
    /// The wallet that will cover the gas costs of the request
    address public sponsorWallet;
    /// The random number returned by the QRNG Airnode
    uint256 public _qrngUint256;
    /// The array of random numbers returned by the QRNG Airnode
    uint256[] public _qrngUint256Array;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    /// @notice Sets the parameters for making requests
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    /// @notice To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(msg.sender).transfer(msg.value);
        emit WithdrawalRequested(airnode, sponsorWallet);
    }

    /// @notice Requests a `uint256`
    /// @dev This request will be fulfilled by the contract's sponsor wallet,
    /// which means spamming it may drain the sponsor wallet.
    function makeRequestUint256() external returns (bytes32) {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode, endpointIdUint256, address(this), sponsorWallet, address(this), this.fulfillUint256.selector, ""
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256(requestId);
        return requestId;
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256(bytes32 requestId, bytes calldata data) external onlyAirnodeRrp {
        require(expectingRequestWithIdToBeFulfilled[requestId], "Request ID not known");
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        _qrngUint256 = qrngUint256;
        // Do what you want with `qrngUint256` here...
        emit ReceivedUint256(requestId, qrngUint256);
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
        emit RequestedUint256Array(requestId, size);
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
        emit ReceivedUint256Array(requestId, qrngUint256Array);
    }

    /// @notice Getter functions to check the returned value.
    function getRandomNumber() public view returns (uint256) {
        return _qrngUint256;
    }

    function getRandomNumberArray() public view returns (uint256[] memory) {
        return _qrngUint256Array;
    }

    /// @notice To withdraw funds from the sponsor wallet to the contract.
    function withdraw() external {
        airnodeRrp.requestWithdrawal(airnode, sponsorWallet);
    }

    //////// GAME

    using SortLib for uint256[];

    //-------- Errors
    error GameAtCapacity();
    error EntryFeeNotMet(uint256 feeAmount);
    error PlayerIndexNotExist(uint256 playerIndex);
    error NotAuthorized();

    //-------- Events
    event GameStarted(uint256 indexed numberOfPlayers);
    event PlayerAdded(address indexed playerAddress, uint256 indexed playerIndex);
    event PlayerPlayedRound(uint256 indexed playerIndex);

    ///  These are 6 faces of a die denoted by integers.
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

    ///  These are the ranks that a hand can have in the end,
    ///  ordered from the highest to the lowest in points
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

    ///  This will represent the various game states
    enum GameState {
        WaitingOnPlayersToJoin,
        WaitingOnPlayerTurn,
        Started,
        FinishedRound
    }

    ///  This is how a player would be represented in our game,
    ///  their name and the hand they have chosen
    struct Player {
        /// index of the player
        uint256 index;
        /// address of the player
        address playerAddr;
        /// hand chosen in the current round
        uint256[] hand;
        /// bet amount
        uint256 bet;
        /// turn player played
        uint256 turn;
    }

    /// Number of max players in this game
    uint256 private s_totalNumberOfPlayers;
    /// Number of players in this game currently
    uint256 private s_currentCountOfPlayers;
    /// State of the respective players in the game
    mapping(uint256 => Player) private playerState;
    /// Game state
    GameState private s_gameState;
    /// Total value of bets
    uint256 private s_totalBets;

    // TODO: Remove this constant value for a dynamic entry fee later
    uint256 public constant ENTRY_FEE = 0 ether;

    constructor(uint256 _numberOfPlayers, address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {
        // Setup the game
        s_totalNumberOfPlayers = _numberOfPlayers;
        emit GameStarted(s_totalNumberOfPlayers);

        s_gameState = GameState.WaitingOnPlayersToJoin;
    }

    ///  @dev This is called to join the game that was started
    ///  @notice The player wanting to join will will call this function
    function joinGame() public payable {
        // Check if game is not full, else join.
        if (s_currentCountOfPlayers >= s_totalNumberOfPlayers) {
            revert GameAtCapacity();
        }

        // Check for entry fee
        if (msg.value < ENTRY_FEE) {
            revert EntryFeeNotMet(ENTRY_FEE);
        }

        s_totalBets += msg.value;

        // Add the player, Everyone starts with a 0 (No cards on them)
        uint256[] memory startingHand = new uint256[](5);

        Player memory newPlayer = Player({
            index: s_currentCountOfPlayers,
            playerAddr: msg.sender,
            hand: startingHand,
            bet: msg.value,
            turn: 0
        });

        emit PlayerAdded(msg.sender, s_currentCountOfPlayers);

        playerState[s_currentCountOfPlayers] = newPlayer;
        s_currentCountOfPlayers += 1;

        // Game state update, can start to play now
        if (s_currentCountOfPlayers == s_totalNumberOfPlayers) {
            s_gameState = GameState.WaitingOnPlayerTurn;
        }
    }

    ///  @dev function call that kicks of the random arr gen function
    ///  @param _numberOfDiceToRoll is the number of dice to roll
    ///  @return listOfDice is the dice rolls
    function prePlayRound(uint256 _numberOfDiceToRoll) external returns (bytes32) {
        bytes32 requestId = this.makeRequestUint256Array(_numberOfDiceToRoll);
        return requestId;
    }

    ///  @dev this function is called from the player, this will play a round lock in his hand, roll dice
    ///  @param _playerIndex is the index of the player
    ///  @param _indicesOfDice are the index of dice that are (re)rolled
    function playRound(uint256 _playerIndex, uint256[] memory _indicesOfDice) external {
        // Player playing his own turn?
        if (playerState[_playerIndex].playerAddr != msg.sender) {
            revert NotAuthorized();
        }

        // A player gets no more than two turns
        if (playerState[_playerIndex].turn >= 2) {
            revert("player has exhausted turns");
        }

        // This will be called after the palyer has locked his bets
        // A player can choose not to re-roll any dice at a given point
        uint256[] memory listOfRandomDice;

        // It should call the _rollDice fn that will give new random values to the palyer
        uint256 numberOfDiceToRoll = _indicesOfDice.length;
        // listOfRandomDice = _rollDice(numberOfDiceToRoll);
        listOfRandomDice = this.getRandomNumberArray();

        // Update the player state to DoneWithTurn
        playerState[_playerIndex].turn += 1;
        uint256[] storage playersHand = playerState[_playerIndex].hand;

        for (uint256 i = 0; i < numberOfDiceToRoll; i++) {
            uint256 indexToChange = _indicesOfDice[i];
            playersHand[indexToChange] = (listOfRandomDice[i] % 6) + 1; // 6 faces, 0 discarded
        }

        // Update the game state
        _updateGameState();
    }

    ///  @dev Internal function call that will update the game state based on the number
    /// turns taken by the player
    function _updateGameState() internal {
        uint256 totalPlayersCount = s_totalNumberOfPlayers;

        for (uint256 i = 0; i < totalPlayersCount; i++) {
            if (playerState[i].turn >= 2) {
                s_gameState = GameState.WaitingOnPlayerTurn;
                break;
            }
        }

        s_gameState = GameState.FinishedRound;
    }

    ///  @dev this function will take index and either to add or reduce the amount from their bets
    ///  @param _playerIndex is the index of the player in the mapping
    ///  @param _toAdd is a bool representing to add or remove from bet
    function changeBet(uint256 _playerIndex, bool _toAdd) public payable {
        // TODO: Cannnot remove balance if no bet placed.

        Player storage currentPlayer = playerState[_playerIndex];

        if (_toAdd) {
            currentPlayer.bet += msg.value;
            s_totalBets += msg.value;
        } else {
            currentPlayer.bet -= msg.value;
            s_totalBets -= msg.value;
        }

        // Add the bet amount to the contract.
    }

    ///  @dev this fn will pick the index of the player that won this round
    ///  @return uint256 winnderIndex is the index of the winner
    function pickWinner() external returns (uint256) {
        if (s_gameState == GameState.WaitingOnPlayerTurn) {
            revert("not all players have played their turn");
        }

        // Store all player ranks here
        uint256[] memory playerRanks = new uint256[](s_totalNumberOfPlayers);

        // Loop through all the players and sort them on their hands
        for (uint256 i = 0; i < s_totalNumberOfPlayers; i++) {
            Player memory player = playerState[i];

            // evaluvate a players hand
            Ranks finalRank = evaluvateHand(player.hand);
            playerRanks[i] = uint256(finalRank);
        }

        // Sort player ranks to find the winner, the one with max is the winner
        playerRanks.sort();

        // TODO: Returns max of one player, need to change this for ties
        return playerRanks[playerRanks.length - 1];
    }

    /// @dev this function goes through a hand and returns the rank of that particular hand
    function evaluvateHand(uint256[] memory hand) internal returns (Ranks) {
        // sort the hand
        hand.sort();

        // Check for combinations
        if (isFiveOfAKind(hand)) {
            return Ranks.FiveOfAKind;
        } else if (isFourOfAKind(hand)) {
            return Ranks.FourOfAKind;
        } else if (isFullHouse(hand)) {
            return Ranks.FullHouse;
        } else if (isStraight(hand)) {
            return Ranks.Straight;
        } else if (isThreeOfAKind(hand)) {
            return Ranks.ThreeOfAKind;
        } else if (isTwoPair(hand)) {
            return Ranks.TwoPair;
        } else if (isPair(hand)) {
            return Ranks.Pair;
        } else {
            return Ranks.Bust;
        }
    }

    function isFiveOfAKind(uint256[] memory hand) internal pure returns (bool) {
        return hand[0] == hand[4];
    }

    function isFourOfAKind(uint256[] memory hand) internal pure returns (bool) {
        return hand[0] == hand[3] || hand[1] == hand[4];
    }

    function isThreeOfAKind(uint256[] memory hand) internal pure returns (bool) {
        return (hand[0] == hand[2]) || (hand[1] == hand[3]) || (hand[2] == hand[4]);
    }

    function isStraight(uint256[] memory hand) internal pure returns (bool) {
        for (uint256 i = 0; i < 4; i++) {
            if (hand[i] + 1 != hand[i + 1]) {
                return false;
            }
        }
        return true;
    }

    function isFullHouse(uint256[] memory hand) internal pure returns (bool) {
        return (hand[0] == hand[2] && hand[3] == hand[4]) || (hand[0] == hand[1] && hand[2] == hand[4]);
    }

    function isTwoPair(uint256[] memory hand) internal pure returns (bool) {
        return (hand[0] == hand[1] && hand[2] == hand[3]) || (hand[0] == hand[1] && hand[3] == hand[4])
            || (hand[1] == hand[2] && hand[3] == hand[4]);
    }

    function isPair(uint256[] memory hand) internal pure returns (bool) {
        return (hand[0] == hand[1]) || (hand[1] == hand[2]) || (hand[2] == hand[3]) || (hand[3] == hand[4]);
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
    
    function getPlayerDetails(uint256 _playerIndex) public view returns(Player memory){
        if (_playerIndex >= s_totalNumberOfPlayers) {
            revert PlayerIndexNotExist(_playerIndex);
        }
        return playerState[_playerIndex];
    }

    function getGameState() public view returns (GameState) {
        return s_gameState;
    }

    function getTotalPrizePool() public view returns (uint256) {
        return s_totalBets;
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IVerifier {
   function verifyProof(
       uint256[2] memory a,
       uint256[2][2] memory b,
       uint256[2] memory c,
       uint256[9] memory input
  ) external view returns (bool);
}

contract MagicSquare {
    address public verifierAddr;

    uint8[3][3][3] MagicSquareBoardList = [
        [
            [0, 9, 0],
            [0, 0, 0],
            [0, 0, 8]
        ],
        [
             [8, 0, 0],
             [0, 0, 0],
             [0, 9, 0]
        ],
        [
            [0, 0, 8],
            [9, 0, 0],
            [0, 0, 0]
        ]
    ];

    constructor(address _verifierAddr) {
        verifierAddr = _verifierAddr;
    }

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[9] memory input
    ) public view returns (bool) {
        return IVerifier(verifierAddr).verifyProof(a, b, c, input);
    }

    function verifyMagicSquareBoard(uint256[9] memory board)
        private
        view
        returns (bool)
    {
        bool isEqual = true;
        for (uint256 i = 0; i < MagicSquareBoardList.length; ++i) {
            isEqual = true;
            for (uint256 j = 0; j < MagicSquareBoardList[i].length; ++j) {
                for (uint256 k = 0; k < MagicSquareBoardList[i][j].length; ++k) {
                    if (board[3 * j + k] != MagicSquareBoardList[i][j][k]) {
                        isEqual = false;
                        break;
                    }
                }
            }
            if (isEqual == true) {
                return isEqual;
            }
        }
        return isEqual;
    }

    function verifyMagicSquare(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[9] memory input
    ) public view returns (bool) {
        require(verifyMagicSquareBoard(input), "This board does not exist");
        require(verifyProof(a, b, c, input), "Filed proof check");
        return true;
    }

    function pickRandomBoard(string memory stringTime)
        private
        view
        returns (uint8[3][3] memory)
    {
        uint256 randPosition = uint256(
            keccak256(
                abi.encodePacked(
                    block.difficulty,
                    block.timestamp,
                    msg.sender,
                    stringTime
                )
            )
        ) % MagicSquareBoardList.length;
        return MagicSquareBoardList[randPosition];
    }

    function generateMagicSqureBoard(string memory stringTime)
        public
        view
        returns (uint8[3][3] memory)
    {
        return pickRandomBoard(stringTime);
    }
}

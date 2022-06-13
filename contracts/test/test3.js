const { expect } = require("chai");
const { ethers } = require("hardhat");
const { exportCallDataGroth16 } = require("./utils/utils");
const {buildPoseidon}= require("circomlibjs");

describe("Magic square 3x3", function () {
  let MagicSquareVerifier, magicSquare3Verifier, MagicSquare, magicSquare3;

  before(async function () {
    MagicSquareVerifier = await ethers.getContractFactory("MagicSquareVerifier");
    magicSquare3Verifier = await MagicSquareVerifier.deploy();
    await magicSquare3Verifier.deployed();

    MagicSquare= await ethers.getContractFactory("MagicSquare");
    magicSquare3 = await MagicSquare.deploy(magicSquare3Verifier.address);
    await magicSquare3.deployed();
  });

  it("Should generate a board", async function () {
   let board = await magicSquare3.generateMagicSqureBoard(new Date().toString());
   console.log(board);
    expect(board.length).to.equal(3);
  });

  it("Should return true for valid proof on-chain", async function () {
    poseidon= await buildPoseidon();
    const privSalt = 5;
    const hash_buff = poseidon([privSalt, 2, 0, 4, 7, 5, 3, 6, 1, 0]);
    //console.log(hash_buff);
    const pubSolnHash = poseidon.F.toString(hash_buff);
    
    const INPUT = {
      puzzle: [
        [0, 9, 0],
        [0, 0, 0],
        [0, 0, 8]
      ],
      solution: [
        [2, 0, 4],
        [7, 5, 3],
        [6, 1, 0]
      ],
      privSalt,
      pubSolnHash,
    }
    //console.log(INPUT);

    let dataResult = await exportCallDataGroth16(
      INPUT,
      "./zkproof/MagicSquare3.wasm",
      "./zkproof/MagicSquare3_final.zkey"
    );
    console.log(dataResult);
    // Call the function.
    let result = await magicSquare3Verifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    expect(result).to.equal(true);
  });

  it("Should return false for invalid proof on-chain", async function () {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let Input = new Array(2).fill(0);

    let dataResult = { a, b, c, Input };

    // Call the function.
    let result = await magicSquare3Verifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    expect(result).to.equal(false);
  });
  
});
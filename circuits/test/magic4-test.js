const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;
const {buildPoseidon}= require("circomlibjs");

describe("Magic square 4x4 circuit", function () {
    this.timeout(100000000);
  let magicSquareCircuit;

  before(async function () {
    magicSquareCircuit = await wasm_tester("magic4/MagicSquare4.circom");
  });

  it("Should generate the witness successfully", async function () {
    poseidon= await buildPoseidon();
    const privSalt = 5;
    const hash_buff = poseidon([0, 14, 4, 15, 8, 11, 5, 0, 13, 2, 0, 3, 12, 0, 9, 6]);
    const pubSolnHash1 = poseidon.F.toString(hash_buff);
    //console.log(pubSolnHash1);
    poseidon1= await buildPoseidon();
    const hash_buff1 = poseidon1([privSalt, pubSolnHash1]);
    const pubSolnHash = poseidon1.F.toString(hash_buff1);
    //console.log(pubSolnHash);

    const input = {
      "puzzle": [
        ["1", "0", "0", "0"],
        ["0", "0", "0", "10"],
        ["0", "0", "16", "0"],
        ["0", "7", "0", "0"]
      ],
      "solution": [
        ["0", "14", "4", "15"],
        ["8", "11", "5", "0"],
        ["13", "2", "0", "3"],
        ["12", "0", "9", "6"]
      ],
      privSalt,
      pubSolnHash,
    }
    const witness = await magicSquareCircuit.calculateWitness(input);
    await magicSquareCircuit.assertOut(witness, {});
  });
});
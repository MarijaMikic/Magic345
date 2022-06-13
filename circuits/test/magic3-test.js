const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;
const {buildPoseidon}= require("circomlibjs");

describe("Magic square 3x3 circuit", function () {
    this.timeout(100000000);
  let magicSquareCircuit;

  before(async function () {
    magicSquareCircuit = await wasm_tester("magic3/MagicSquare3.circom");
  });

  it("Should generate the witness successfully", async function () {
    poseidon= await buildPoseidon(); 
    const privSalt = 5;
    const hash_buff = poseidon([privSalt, 2, 0, 4, 7, 5, 3, 6, 1, 0]);
    const pubSolnHash = poseidon.F.toString(hash_buff);
    const input = {
      "puzzle": [
        ["0", "9", "0"],
        ["0", "0", "0"],
        ["0", "0", "8"]
      ],
      "solution": [
        ["2", "0", "4"],
        ["7", "5", "3"],
        ["6", "1", "0"]
      ],
      privSalt,
      pubSolnHash,
    }
    const witness = await magicSquareCircuit.calculateWitness(input);
    await magicSquareCircuit.assertOut(witness, {});
  });
});
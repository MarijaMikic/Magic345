const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;
const {buildPoseidon}= require("circomlibjs");

describe("Magic square 5x5 circuit", function () {
    this.timeout(100000000);
  let magicSquareCircuit;

  before(async function () {
    magicSquareCircuit = await wasm_tester("magic5/MagicSquare5.circom");
  });

  it("Should generate the witness successfully", async function () {
    poseidon= await buildPoseidon();
    const privSalt = 5;
    const hash_buff = poseidon([0, 0, 4, 23, 0, 0, 0 , 0, 5, 0, 0, 19, 0, 0, 1]);
    const pubSolnHash1 = poseidon.F.toString(hash_buff);
    //console.log(pubSolnHash1);
    poseidon1= await buildPoseidon();
    const hash_buff1= poseidon([2, 0, 20, 0, 8, 9, 0, 22, 0, 15]);
    const pubSolnHash2 = poseidon.F.toString(hash_buff1);
    poseidon2= await buildPoseidon();
    const hash_buff2 = poseidon2([privSalt, pubSolnHash1, pubSolnHash2]);
    const pubSolnHash = poseidon2.F.toString(hash_buff2);
    //console.log(pubSolnHash);

    const input = {
      "puzzle": [
        ["11", "10", "0", "0", "17"],
        ["18", "12", "6", "0", "24"],
        ["25", "0", "13", "7", "0"],
        ["0", "21", "0", "14", "0"],
        ["0", "3", "0", "16", "0"]
      ],
      "solution": [
        ["0", "0", "4", "23", "0"],
        ["0", "0", "0", "5", "0"],
        ["0", "19", "0", "0", "1"],
        ["2", "0", "20", "0", "8"],
        ["9", "0", "22", "0", "15"]
      ],
      privSalt,
      pubSolnHash,
    }
    const witness = await magicSquareCircuit.calculateWitness(input);
    await magicSquareCircuit.assertOut(witness, {});
  });
});
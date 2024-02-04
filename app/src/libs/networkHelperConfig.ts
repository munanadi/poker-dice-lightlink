type NetworkConfig = {
  airnodeRrpContractAddress: `0x${string}`;
  airnodeAddress: `0x${string}`;
  airnodeXPub: `xpub${string}`;
  endpointUint256: `0x${string}`;
  endpointUint256Array: `0x${string}`;
};

export function fetchParametersForChain(chainId: number): NetworkConfig {
  switch (chainId) {
    // Polygon Mumbai Testnet
    case 80001:
      return {
        airnodeRrpContractAddress: "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd",
        airnodeAddress: "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D",
        airnodeXPub:
          "xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo",
        endpointUint256:
          "0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36",
        endpointUint256Array:
          "0x9877ec98695c139310480b4323b9d474d48ec4595560348a2341218670f7fbc2",
      };
    case 1891:
      return {
        airnodeRrpContractAddress: "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd",
        airnodeAddress: "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D",
        airnodeXPub:
          "xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo",
        endpointUint256:
          "0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36",
        endpointUint256Array:
          "0x9877ec98695c139310480b4323b9d474d48ec4595560348a2341218670f7fbc2",
      };
    default:
      return {
        airnodeRrpContractAddress: "0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd",
        airnodeAddress: "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D",
        airnodeXPub:
          "xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo",
        endpointUint256:
          "0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36",
        endpointUint256Array:
          "0x9877ec98695c139310480b4323b9d474d48ec4595560348a2341218670f7fbc2",
      };
  }
}

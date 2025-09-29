// eslint-disable-next-line import/no-anonymous-default-export
export default {
  address:
    process.env.REACT_APP_MAINNET === "1"
      ? "0xbD60A3abc62F28C079c4DaEc05E898214E81e05E"
      : "0xD0997A262C2f7EeE1A980a9F5f948C73651A2914",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_escrowAddress",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "AccessControlBadConfirmation",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          internalType: "bytes32",
          name: "neededRole",
          type: "bytes32"
        }
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32"
        }
      ],
      name: "RoleAdminChanged",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address"
        }
      ],
      name: "RoleGranted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address"
        }
      ],
      name: "RoleRevoked",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "escrowAddress",
          type: "address"
        }
      ],
      name: "SetEscrowAddress",
      type: "event"
    },
    {
      inputs: [],
      name: "ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "ESCROW_MANAGER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "escrowAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "collectionAddresses",
          type: "address[]"
        },
        {
          internalType: "uint256[][]",
          name: "tokenIds",
          type: "uint256[][]"
        }
      ],
      name: "getBatchAssetData",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "assetPrice",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "referralFee",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "marketplaceFee",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "shipmentFees",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "tax",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "time",
              type: "uint256"
            },
            {
              internalType: "address",
              name: "token",
              type: "address"
            },
            {
              internalType: "address",
              name: "owner",
              type: "address"
            },
            {
              internalType: "address",
              name: "buyer",
              type: "address"
            },
            {
              internalType: "address",
              name: "subAdmin",
              type: "address"
            },
            {
              internalType: "bool",
              name: "isSold",
              type: "bool"
            },
            {
              internalType: "bool",
              name: "isRedeem",
              type: "bool"
            },
            {
              internalType: "bool",
              name: "isTaxToSeller",
              type: "bool"
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "lockTime",
                  type: "uint256"
                },
                {
                  internalType: "string",
                  name: "disputeMessageByUser",
                  type: "string"
                },
                {
                  internalType: "string",
                  name: "decisionRemarksByPlatform",
                  type: "string"
                },
                {
                  internalType: "bool",
                  name: "isLocked",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isCanceled",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isAssetPriceWithdrawn",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isPlatformFeeWithdrawn",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isShipmentWithdrawn",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isTaxWithdrawn",
                  type: "bool"
                }
              ],
              internalType: "struct GalileoEscrowStorage.Escrow",
              name: "escrow",
              type: "tuple"
            }
          ],
          internalType: "struct GalileoEscrowStorage.AssetInfo[][]",
          name: "",
          type: "tuple[][]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        }
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "collectionAddresses",
          type: "address[]"
        },
        {
          internalType: "address[]",
          name: "transferAssetOwnerships",
          type: "address[]"
        },
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        },
        {
          internalType: "uint256[]",
          name: "amountToUsers",
          type: "uint256[]"
        },
        {
          internalType: "uint256[]",
          name: "relistPrices",
          type: "uint256[]"
        },
        {
          internalType: "bool[]",
          name: "taxes",
          type: "bool[]"
        },
        {
          internalType: "bool[]",
          name: "shipmentFees",
          type: "bool[]"
        },
        {
          internalType: "string[]",
          name: "decisionsRemarksByPlatform",
          type: "string[]"
        }
      ],
      name: "makeDecision",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "callerConfirmation",
          type: "address"
        }
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_escrowAddress",
          type: "address"
        }
      ],
      name: "setEscrowAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4"
        }
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]
};

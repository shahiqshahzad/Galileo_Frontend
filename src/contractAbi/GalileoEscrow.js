// eslint-disable-next-line import/no-anonymous-default-export
export default {
  address:
    process.env.REACT_APP_MAINNET === "1"
      ? "0x1830f7D1bc8B372FB0fd293484601fFd6054fBAf"
      : "0xEe90128a82487D20C32fACE3E2F57f9b67Eb909a",
  _format: "hh-sol-artifact-1",
  contractName: "GalileoEscrow",
  sourceName: "contracts/GalileoEscrow.sol",
  abi: [
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
      inputs: [],
      name: "AccessDenied",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address"
        }
      ],
      name: "AddressEmptyCode",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "AddressInsufficientBalance",
      type: "error"
    },
    {
      inputs: [],
      name: "DisputeCancelled",
      type: "error"
    },
    {
      inputs: [],
      name: "DisputeCleared",
      type: "error"
    },
    {
      inputs: [],
      name: "EscrowTimeOver",
      type: "error"
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidAddress",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidInitialization",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidInput",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidLength",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidOwner",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidPrice",
      type: "error"
    },
    {
      inputs: [],
      name: "NotInitializing",
      type: "error"
    },
    {
      inputs: [],
      name: "PendingDecision",
      type: "error"
    },
    {
      inputs: [],
      name: "ProtocolAlreadyConfigured",
      type: "error"
    },
    {
      inputs: [],
      name: "ReentrancyGuardReentrantCall",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        }
      ],
      name: "SafeERC20FailedOperation",
      type: "error"
    },
    {
      inputs: [],
      name: "UninitializedProtocol",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "assetPrice",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "referralFee",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "marketplaceFee",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tax",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256"
        }
      ],
      name: "AssetData",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "CancelDispute",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "escrowTime",
          type: "uint256"
        }
      ],
      name: "ConfigureCollection",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64"
        }
      ],
      name: "Initialized",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "transferAssetOwnership",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountToUser",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountToSeller",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "tax",
          type: "bool"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "taxAmount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "shipment",
          type: "bool"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "shipmentFees",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "decisionRemarksByPlatform",
          type: "string"
        }
      ],
      name: "MakeDecision",
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
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "escrowTime",
          type: "uint256"
        }
      ],
      name: "SetEscrowTime",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timeStamp",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "disputeMessageByUser",
          type: "string"
        }
      ],
      name: "SubmitDispute",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "escrowTime",
          type: "uint256"
        }
      ],
      name: "UpdateConfigureCollection",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isRedeem",
          type: "bool"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "shipmentFee",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isTaxToSeller",
          type: "bool"
        }
      ],
      name: "UpdateRedeemAssetData",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "tokenAddresses",
          type: "address[]"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "tokenAmounts",
          type: "uint256[]"
        },
        {
          indexed: true,
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          indexed: false,
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        }
      ],
      name: "WithdrawFunds",
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
      name: "HELPER_ROLE",
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
      name: "MARKETPLACE_ROLE",
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
      name: "SUB_ADMIN_ROLE",
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
          internalType: "address",
          name: "_marketplace",
          type: "address"
        }
      ],
      name: "__GalileoEscrow_init",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "subAdmin",
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
          name: "token",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "assetPrice",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "tax",
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
          internalType: "bool",
          name: "isSold",
          type: "bool"
        }
      ],
      name: "addAssetData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "enum GalileoEscrowStorage.AddressType",
          name: "addressType",
          type: "uint8"
        },
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        }
      ],
      name: "calculateFunds",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]"
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "cancelDispute",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "escrowTime",
          type: "uint256"
        }
      ],
      name: "configureCollection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getAssetData",
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
          internalType: "struct GalileoEscrowStorage.AssetInfo",
          name: "",
          type: "tuple"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        }
      ],
      name: "getCollectionInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
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
          internalType: "address",
          name: "fundsCollector",
          type: "address"
        }
      ],
      name: "getTokenIds",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "collectionAddresses",
              type: "address"
            },
            {
              internalType: "uint256[]",
              name: "tokenIds",
              type: "uint256[]"
            }
          ],
          internalType: "struct GalileoEscrowStorage.AssetsPerCollection[]",
          name: "",
          type: "tuple[]"
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
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "transferAssetOwnership",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amountToUser",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "relistPrice",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "tax",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "shipment",
          type: "bool"
        },
        {
          internalType: "string",
          name: "decisionRemarksByPlatform",
          type: "string"
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
          internalType: "address",
          name: "operator",
          type: "address"
        },
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes"
        }
      ],
      name: "onERC721Received",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4"
        }
      ],
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
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        }
      ],
      name: "setEscrowTime",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "_disputeMessageByUser",
          type: "string"
        }
      ],
      name: "submitDispute",
      outputs: [],
      stateMutability: "nonpayable",
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
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        },
        {
          internalType: "string[]",
          name: "_disputeMessagesByUser",
          type: "string[]"
        }
      ],
      name: "submitMultipleDisputes",
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
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "escrowTime",
          type: "uint256"
        }
      ],
      name: "updateConfigureCollection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "shipmentFee",
          type: "uint256"
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
        }
      ],
      name: "updateRedeemAssetData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "enum GalileoEscrowStorage.AddressType",
          name: "addressType",
          type: "uint8"
        },
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        }
      ],
      name: "withdrawFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "enum GalileoEscrowStorage.AddressType",
          name: "addressType",
          type: "uint8"
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "address",
          name: "collectionAddress",
          type: "address"
        },
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        }
      ],
      name: "withdrawFundsByAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ]
};

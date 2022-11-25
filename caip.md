## CAIP-2
### Syntax
```
base58char = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
              "A" / "B" / "C" / "D" / "E" / "F" / "G" / "H" / "J" / "K" /
              "L" / "M" / "N" / "P" / "Q" / "R" / "S" / "T" / "U" / "V" /
              "W" / "X" / "Y" / "Z" /
              "a" / "b" / "c" / "d" / "e" / "f" / "g" / "h" / "i" / "j" /
              "k" / "m" / "n" / "o" / "p" / "q" / "r" / "s" / "t" / "u" /
              "v" / "w" / "x" / "y" / "z"
```
**`tz:Net{12 * base58char}`**

### Example
`tz:NetXdQprcVkpaWU`

## CAIP-10
### Syntax

```
base58char = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
              "A" / "B" / "C" / "D" / "E" / "F" / "G" / "H" / "J" / "K" /
              "L" / "M" / "N" / "P" / "Q" / "R" / "S" / "T" / "U" / "V" /
              "W" / "X" / "Y" / "Z" /
              "a" / "b" / "c" / "d" / "e" / "f" / "g" / "h" / "i" / "j" /
              "k" / "m" / "n" / "o" / "p" / "q" / "r" / "s" / "t" / "u" /
              "v" / "w" / "x" / "y" / "z"
```

**`tz:Net{12 * base58char}:{"tz1" / "tz2" / "tz3"}{33 * base58char}`**

### Example
`tz:NetXdQprcVkpaWU:tz1MVqWiyfMbSESTaGEPxFjDWdM9zSXy1hcg`

`tz:NetXnHfVqm9iesp:tz3gN8NTLNLJg5KRsUU47NHNVHbdhcFXjjaB`

## CAIP-122

### Signing Algorithm
* ed25519 for tz1... account
* secp256k1 for tz2... account
* p256 for tz3... account

### Signature Type
ed25519 or secp256k1 or p256 according to the account type

### Signature Creation

We propose the following string format, inspired from EIP-4361

```
${domain} wants you to sign in with your tezos account:
${address}

${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chain-id}
Nonce: ${nonce}
Issued At: ${timestamp}
Expiration Time: ${expiration-time}
Not Before: ${not-before}
Request ID: ${request-id}
Resources:
- ${resources[0]}
- ${resources[1]}
...
- ${resources[n]}

Type: ${type}
Signature: ${signature}
```

### Signature Verification
Tezos signature and public key are bs58check encoded with prefix. 
So prefix in signature and public key should be removed before verification.

Prefix of signature:
* ed25519 -> edsig [9, 245, 205, 134, 18]
* secp256k1 -> spsig1 [13, 115, 101, 19, 63]
* p256 -> p2sig [54, 240, 44, 52]

Prefix of public key:
* ed25519 -> edpk [13, 15, 37, 217]
* secp256k1 -> sppk [3, 254, 226, 86]
* p256 -> p2pk [3, 178, 139, 127]
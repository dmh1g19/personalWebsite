---
title: Exploring the Trusted Platform Module (TPM)
description: the most popular root of trust method for most computers
category: Sec ops
recommended: true
---

# What is a TPM?
<br>

<img src="/img/tpm.webp" alt="tmp chip" width="400">

A Trusted Platform Module (TPM) is commonly used as a root of trust in many computers. A TPM is a specialized chip on an endpoint device that is designed to secure hardware through integrated cryptographic keys. Its primary purpose is to safeguard the system by integrating cryptographic keys into devices.

The TPM can be used for various security operations such as disk encryption, secure boot, and hardware-based authentication.

# 1. Start the chip

```bash
 tpm2_startup -c -T mssim:host=localhost,port=2321
```

This command initializes the TPM simulator. -c clears the TPM memory (similar to resetting the TPM), and -T mssim:host=localhost,port=2321 specifies that the TPM tool (tpm2) should communicate with a TPM simulator running on the local machine (localhost) and listening on port 2321.

# 2. Read a PCR

```bash
 tpm2_pcrread -T mssim:host=localhost,port=2321 sha256
```

This reads the current values of the PCR slots using the SHA-256 hashing algorithm. PCRs are special registers in a TPM used to store hash values that represent a snapshot of the system state. They are used in the secure boot process and software attestation to ensure system integrity.

```bash
  sha256:
    0 : 0x0000000000000000000000000000000000000000000000000000000000000000
    1 : 0x0000000000000000000000000000000000000000000000000000000000000000
    2 : 0x0000000000000000000000000000000000000000000000000000000000000000
    3 : 0x0000000000000000000000000000000000000000000000000000000000000000
    4 : 0x0000000000000000000000000000000000000000000000000000000000000000
    5 : 0x0000000000000000000000000000000000000000000000000000000000000000
    6 : 0x0000000000000000000000000000000000000000000000000000000000000000
    7 : 0x0000000000000000000000000000000000000000000000000000000000000000
    8 : 0x0000000000000000000000000000000000000000000000000000000000000000
    9 : 0x0000000000000000000000000000000000000000000000000000000000000000
    10: 0x0000000000000000000000000000000000000000000000000000000000000000
    11: 0x0000000000000000000000000000000000000000000000000000000000000000
    12: 0x0000000000000000000000000000000000000000000000000000000000000000
    13: 0x0000000000000000000000000000000000000000000000000000000000000000
    14: 0x0000000000000000000000000000000000000000000000000000000000000000
    15: 0x0000000000000000000000000000000000000000000000000000000000000000
    16: 0x0000000000000000000000000000000000000000000000000000000000000000
    17: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    18: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    19: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    20: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    21: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    22: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    23: 0x0000000000000000000000000000000000000000000000000000000000000000
```

# 3. Calculate SHA-256 hash

```bash
 SHA256_DATA=$(echo "CRITICAL-DATA" | openssl dgst -sha256 -binary | xxd -p -c 32)
```

We will simply use the plain text "CRITICAL-DATA" as our sensitive data that we will be encrypting and decrypting.

This command calculates the SHA-256 hash of the string "CRITICAL-DATA", converts the output to binary, and then formats it as a hex string. 

The result is stored in the variable SHA256_DATA.

```bash
 SHA256_DATA = ab805369897acf5a4536130b2d8799d6bcb9506de0f490b656ff7037f360a005
```

# 4. Calculate SHA-1 hash

```bash
 SHA1_DATA=$(echo "CRITICAL-DATA" | openssl dgst -sha1 -binary | xxd -p -c 20)
```

Similar to the previous step, this calculates the SHA-1 hash of the string "CRITICAL-DATA", converts it to binary, formats it as a hex string.

The result is stored in the variable SHA1_DATA.

```bash
 SHA1_DATA = 39739bfcd59c10bc8b220398a4c868dbe41c455c
```

# 5. Extend PCR 0, 1, and 2 with the calculated hash values

```bash
 tpm2_pcrextend 0:sha1=$SHA1_DATA,sha256=$SHA256_DATA -T mssim:host=localhost,port=2321

 tpm2_pcrextend 1:sha1=$SHA1_DATA,sha256=$SHA256_DATA -T mssim:host=localhost,port=2321 

 tpm2_pcrextend 2:sha1=$SHA1_DATA,sha256=$SHA256_DATA -T mssim:host=localhost,port=2321
```

This extends the values in PCR slots 0, 1, and 2 with the hash values calculated in the previous steps. "Extending" a PCR involves taking the current value of the PCR, concatenating the new hash value, and then hashing the entire string to create a new value for the PCR. This process ensures that the PCR values represent a cumulative hash of all extended values, providing a secure way to measure system state and changes.

In a real system like a computer for example each stage of the boot sequence would concateante the PCR, ensuring secure tracability of execution.

# 6. Read the PCR values

```bash
 tpm2_pcrread -T mssim:host=localhost,port=2321 sha1:0,1,2+sha256:0,1,2
```

Finally, this command reads the PCR values for slots 0, 1, and 2 using both SHA-1 and SHA-256 hashing algorithms to verify that they have been extended correctly with the calculated hash values.

This sequence of commands is essential for TPM management and operations, particularly in environments where security and system integrity are critical.

```bash
  sha1:
    0 : 0xA3EBF00F6520B2C85DBBF3D32B6A8B3A30ABB748
    1 : 0xA3EBF00F6520B2C85DBBF3D32B6A8B3A30ABB748
    2 : 0xA3EBF00F6520B2C85DBBF3D32B6A8B3A30ABB748
  sha256:
    0 : 0xAF42D77065F4791B6738DA5944E6B4074E3190F0993B5EE5D42DC4FBED424ABA
    1 : 0xAF42D77065F4791B6738DA5944E6B4074E3190F0993B5EE5D42DC4FBED424ABA
    2 : 0xAF42D77065F4791B6738DA5944E6B4074E3190F0993B5EE5D42DC4FBED424ABA
```

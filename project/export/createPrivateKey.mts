import type {PrivateKeyType} from "@aniojs/node-openssl-config-gen"
import type {PrivateKey} from "./PrivateKey.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {readFileStringSync} from "@aniojs/node-fs"
import {unlinkSync} from "node:fs"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"

export function createPrivateKey(
	privateKeyType: PrivateKeyType,
	encrypted?: boolean
): PrivateKey {
	const tmpPrivateKeyLocation = secureTemporaryFile()

	const opensslArgs: string[] = [
		"genpkey",
		"-algorithm"
	]

	if (privateKeyType.type === "rsa") {
		opensslArgs.push("RSA")
		opensslArgs.push(`-pkeyopt`)
		opensslArgs.push(`rsa_keygen_bits:${privateKeyType.keySize}`)
	} else {
		opensslArgs.push(`EC`)
		opensslArgs.push(`-pkeyopt`)
		opensslArgs.push(`ec_paramgen_curve:${privateKeyType.curve}`)
	}

	if (encrypted !== false) {
		opensslArgs.push("-aes-256-cbc")
	}

	invokeOpenSSL([
		...opensslArgs,
		"-out",
		tmpPrivateKeyLocation
	])

	const privateKey = readFileStringSync(tmpPrivateKeyLocation)
	unlinkSync(tmpPrivateKeyLocation)

	return {
		value: privateKey,
		isEncrypted: encrypted !== false
	}
}

import type {PrivateKeyType} from "@aniojs/node-openssl-config-gen"
import type {PrivateKey} from "./PrivateKey.mts"
import type {PrivateKeyPassphraseSource} from "./PrivateKeyPassphraseSource.mts"
import {_isValidPassphraseSource} from "#~src/_isValidPassphraseSource.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {readFileStringSync} from "@aniojs/node-fs"
import {unlinkSync} from "node:fs"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"

export function createPrivateKey(
	privateKeyType: PrivateKeyType,
	pkPassphraseSource?: PrivateKeyPassphraseSource|undefined
): PrivateKey {
	const isEncrypted = _isValidPassphraseSource(pkPassphraseSource)
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

	if (isEncrypted) {
		opensslArgs.push("-aes-256-cbc")

		if (pkPassphraseSource.kind === "file") {
			opensslArgs.push("-pass")
			opensslArgs.push(`file:${pkPassphraseSource.filePath}`)
		}
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
		isEncrypted
	}
}

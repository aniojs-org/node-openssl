import type {CA} from "./CA.mts"
import type {MessageDigest} from "@aniojs/node-openssl-config-gen"
import {generateOpenSSLCAConfig} from "#~src/generateOpenSSLCAConfig.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {readFileStringSync, removeSync} from "@aniojs/node-fs"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"

export function createCRL(
	ca: CA, 
	nextCRLInDays: number,
	messageDigest: MessageDigest
): string {
	const caConfig = generateOpenSSLCAConfig(ca.homeDir, {})

	const tmpOpenSSLConfig = secureTemporaryFile(caConfig, ".conf")
	const tmpCRLFile = secureTemporaryFile("", ".crl")

	try {
		invokeOpenSSL([
			"ca",
			"-config",
			tmpOpenSSLConfig,
			"-gencrl",
			"-out",
			tmpCRLFile,
			"-crldays",
			`${nextCRLInDays}`,
			"-md",
			messageDigest
		])

		const crl = readFileStringSync(tmpCRLFile)
		removeSync(tmpCRLFile)

		return crl
	} finally {
		removeSync(tmpOpenSSLConfig)
	}
}

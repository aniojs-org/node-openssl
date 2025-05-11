import type {SignedCertificate} from "./SignedCertificate.mts"
import type {PrivateKey} from "./PrivateKey.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"
import {removeSync} from "@aniojs/node-fs"
import {renameSync} from "node:fs"

export function createPKCS12File(
	cert: SignedCertificate,
	pkey: PrivateKey,
	outFile: string
) {
	const tmpCertFile = secureTemporaryFile(cert, ".crt")
	const tmpPrivateKeyFile = secureTemporaryFile(pkey, ".key")
	const tmpOutFile = secureTemporaryFile("", ".p12")

	try {
		invokeOpenSSL([
			"pkcs12",
			"-export",
			"-in",
			tmpCertFile,
			"-inkey",
			tmpPrivateKeyFile,
			"-out",
			tmpOutFile
		])

		renameSync(tmpOutFile, outFile)
	} finally {
		removeSync(tmpPrivateKeyFile)
		removeSync(tmpCertFile)
	}
}

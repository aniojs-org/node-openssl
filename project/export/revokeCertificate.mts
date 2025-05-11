import type {CA} from "./CA.mts"
import {
	type CertificateRevocationReason,
	type MessageDigest
} from "@aniojs/node-openssl-config-gen"
import {generateOpenSSLCAConfig} from "#~src/generateOpenSSLCAConfig.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {removeSync} from "@aniojs/node-fs"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"
import path from "node:path"

export function revokeCertificate(
	ca: CA,
	serial: string,
	reason: CertificateRevocationReason,
	messageDigest: MessageDigest
) {
	const caConfig = generateOpenSSLCAConfig(ca.homeDir, {})

	const tmpOpenSSLConfig = secureTemporaryFile(caConfig, ".conf")

	try {
		invokeOpenSSL([
			"ca",
			"-config",
			tmpOpenSSLConfig,
			"-revoke",
			path.join(ca.homeDir, "certs", `${serial}.pem`),
			"-crl_reason",
			reason,
			"-md",
			messageDigest
		])
	} finally {
		removeSync(tmpOpenSSLConfig)
	}
}

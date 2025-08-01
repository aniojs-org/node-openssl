import type {CertificateSigningRequestOptions} from "./CertificateSigningRequestOptions.mts"
import type {PrivateKey} from "./PrivateKey.mts"
import type {CertificateSigningRequest} from "./CertificateSigningRequest.mts"
import {
	generateDistinguishedNameSection,
	generatex509ExtensionsSection
} from "@aniojs/node-openssl-config-gen"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"
import {readFileStringSync, removeSync} from "@aniojs/node-fs"
import {_isValidPassphraseSource} from "#~src/_isValidPassphraseSource.mts"

export function createCertificateSigningRequest(
	privateKey: PrivateKey,
	options: CertificateSigningRequestOptions
): CertificateSigningRequest {
	let opensslRequestConf = ``

	opensslRequestConf += `[req]\n`
	opensslRequestConf += `utf8 = yes\n`
	opensslRequestConf += `string_mask = utf8only\n`
	opensslRequestConf += `prompt = no\n`
	opensslRequestConf += `distinguished_name = my_dn\n`
	opensslRequestConf += `req_extensions = my_request_extensions\n`

	opensslRequestConf += `[my_dn]\n`
	opensslRequestConf += generateDistinguishedNameSection(options.distinguishedName)

	opensslRequestConf += `[my_request_extensions]\n`

	if (options.subjectAltName) {
		opensslRequestConf += generatex509ExtensionsSection({
			subjectAltName: options.subjectAltName
		})
	}

	const tmpOpenSSLConfLocation = secureTemporaryFile(opensslRequestConf, ".conf")
	const tmpCSRLocation = secureTemporaryFile("", ".csr")
	const tmpPrivateKeyLocation = secureTemporaryFile(privateKey.value, ".key")

	try {
		const opensslArgs = [
			"req",
			"-new",
			"-config",
			tmpOpenSSLConfLocation,
			`-${options.messageDigest}`,
			"-key",
			tmpPrivateKeyLocation,
			"-out",
			tmpCSRLocation
		]

		const {passphraseSource} = privateKey

		if (_isValidPassphraseSource(passphraseSource)) {
			if (passphraseSource.kind === "file") {
				opensslArgs.push(`-passin`)
				opensslArgs.push(`file:${passphraseSource.filePath}`)
			}
		}

		invokeOpenSSL(opensslArgs)
	} finally {
		removeSync(tmpPrivateKeyLocation)
		removeSync(tmpOpenSSLConfLocation)
	}

	const csr = readFileStringSync(tmpCSRLocation)

	removeSync(tmpCSRLocation)

	return csr as CertificateSigningRequest
}

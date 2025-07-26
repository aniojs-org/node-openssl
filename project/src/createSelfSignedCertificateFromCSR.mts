import type {SignedCertificate} from "#~export/SignedCertificate.mts"
import type {CertificateSigningRequest} from "#~export/CertificateSigningRequest.mts"
import type {SignCertificateSigningRequestOptions} from "#~export/SignCertificateSigningRequestOptions.mts"
import type {PrivateKey} from "#~export/PrivateKey.mts"
import {
	generatex509ExtensionsSection
} from "@aniojs/node-openssl-config-gen"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {invokeOpenSSL} from "./invokeOpenSSL.mts"
import {readFileStringSync, removeSync} from "@aniojs/node-fs"
import {getSerialOfCertificate} from "#~export/getSerialOfCertificate.mts"
import {_isValidPassphraseSource} from "./_isValidPassphraseSource.mts"

export function createSelfSignedCertificateFromCSR(
	csr: CertificateSigningRequest,
	options: SignCertificateSigningRequestOptions,
	privateKey: PrivateKey
): {
	certificate: SignedCertificate
	certificateSerialNumber: string
} {
	let extensions = ``

	extensions += `[my_cert_extensions]\n`
	extensions += generatex509ExtensionsSection(options.x509Extensions)

	const tmpCSRFile = secureTemporaryFile(csr, ".csr")
	const tmpExtensionsFile = secureTemporaryFile(extensions, ".conf")
	const tmpCertFile = secureTemporaryFile("", ".cert")
	const tmpPrivateKey = secureTemporaryFile(privateKey.value, ".key")

	try {
		const opensslArgs = [
			"x509",
			"-req",
			"-in",
			tmpCSRFile,
			"-signkey",
			tmpPrivateKey,
			"-out",
			tmpCertFile,
			"-days",
			`${options.validityInDays}`,
			`-${options.messageDigest}`,
			`-extfile`,
			tmpExtensionsFile,
			`-extensions`,
			"my_cert_extensions"
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
		removeSync(tmpPrivateKey)
	}

	removeSync(tmpCSRFile)
	removeSync(tmpExtensionsFile)

	const cert = readFileStringSync(tmpCertFile)
	removeSync(tmpCertFile)

	return {
		certificate: cert as SignedCertificate,
		certificateSerialNumber: getSerialOfCertificate(cert)
	}
}

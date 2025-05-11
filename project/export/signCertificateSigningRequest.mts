import type {SignedCertificate} from "./SignedCertificate.mts"
import type {CertificateSigningRequest} from "./CertificateSigningRequest.mts"
import type {SignCertificateSigningRequestOptions} from "./SignCertificateSigningRequestOptions.mts"
import type {PrivateKey} from "./PrivateKey.mts"
import type {CA} from "./CA.mts"
import {createSelfSignedCertificateFromCSR} from "#~src/createSelfSignedCertificateFromCSR.mts"
import {generateOpenSSLCAConfig} from "#~src/generateOpenSSLCAConfig.mts"
import {secureTemporaryFile} from "#~src/secureTemporaryFile.mts"
import {invokeOpenSSL} from "#~src/invokeOpenSSL.mts"
import {readFileStringSync, removeSync} from "@aniojs/node-fs"
import {generatex509ExtensionsSection} from "@aniojs/node-openssl-config-gen"
import {getSerialOfCertificate} from "./getSerialOfCertificate.mts"

export function signCertificateSigningRequest(
	csr: CertificateSigningRequest,
	options: SignCertificateSigningRequestOptions,
	signer: PrivateKey | CA
): {
	certificate: SignedCertificate
	certificateSerialNumber: string
} {
	if (typeof signer === "string") {
		return createSelfSignedCertificateFromCSR(csr ,options, signer)
	}

	let caConfig = generateOpenSSLCAConfig(
		signer.homeDir,
		options.distinguishedNamePolicy
	)

	caConfig += `[my_extensions]\n`
	caConfig += generatex509ExtensionsSection(options.x509Extensions)

	const tmpCSRFile = secureTemporaryFile(csr, ".csr")
	const tmpOpenSSLConf = secureTemporaryFile(caConfig, ".conf")
	const tmpCertFile = secureTemporaryFile("", ".cert")

	invokeOpenSSL([
		"ca",
		"-config",
		tmpOpenSSLConf,
		"-in",
		tmpCSRFile,
		"-out",
		tmpCertFile,
		"-days",
		`${options.validityInDays}`,
		"-md",
		options.messageDigest,
		"-extensions",
		`my_extensions`,
		"-batch",
		"-notext"
	])

	removeSync(tmpCSRFile)
	removeSync(tmpOpenSSLConf)

	const cert = readFileStringSync(tmpCertFile)
	removeSync(tmpCertFile)

	return {
		certificate: cert as SignedCertificate,
		certificateSerialNumber: getSerialOfCertificate(cert)
	}
}

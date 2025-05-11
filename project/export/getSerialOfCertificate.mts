import crypto from "node:crypto"

export function getSerialOfCertificate(certificate: string) {
	const cert = new crypto.X509Certificate(certificate)

	return cert.serialNumber
}

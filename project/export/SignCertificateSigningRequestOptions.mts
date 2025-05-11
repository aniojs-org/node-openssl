import type {
	MessageDigest,
	x509Extensions,
	DistinguishedNamePolicy
} from "@aniojs/node-openssl-config-gen"

export type SignCertificateSigningRequestOptions = {
	distinguishedNamePolicy: DistinguishedNamePolicy
	messageDigest: MessageDigest
	validityInDays: number
	x509Extensions: x509Extensions
}

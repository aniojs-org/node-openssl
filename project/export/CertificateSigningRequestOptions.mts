import type {
	MessageDigest,
	DistinguishedName,
	x509Extensions
} from "@aniojs/node-openssl-config-gen"

type SubjectAltName = NonNullable<x509Extensions["subjectAltName"]>

export type CertificateSigningRequestOptions = {
	distinguishedName: DistinguishedName,
	messageDigest: MessageDigest,
	subjectAltName?: SubjectAltName|undefined
}

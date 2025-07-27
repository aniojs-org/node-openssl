import type {x509Extensions} from "@aniojs/node-openssl-config-gen"

export function getLeafCertificateClientAUthX509Extensions(): x509Extensions {
	return {
		"subjectKeyIdentifier": "hash",
		"authorityKeyIdentifier": "keyid:always",

		"!basicConstraints": {"isCA": false},
		"!keyUsage": ["digitalSignature", "keyEncipherment"],
		"!extendedKeyUsage": ["clientAuth"]
	}
}

import type {x509Extensions} from "@aniojs/node-openssl-config-gen"

export function getRootCAX509Extensions(): x509Extensions {
	return {
		"subjectKeyIdentifier": "hash",

		"!basicConstraints": {"isCA": true},
		"!keyUsage": ["cRLSign", "keyCertSign"]
	}
}

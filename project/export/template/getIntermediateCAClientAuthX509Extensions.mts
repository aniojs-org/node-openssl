import type {x509Extensions} from "@aniojs/node-openssl-config-gen"

export function getIntermediateCAClientAuthX509Extensions(): x509Extensions {
	return {
		"subjectKeyIdentifier": "hash",
		"authorityKeyIdentifier": "keyid:always",

		"!basicConstraints": {"isCA": true, "pathLength": 0},
		"!keyUsage": ["cRLSign", "keyCertSign"],
		// although this applies to the cert itself, browsers do check this
		// and reject domain certs issued by this CA
		"!extendedKeyUsage": ["clientAuth"],
		// also restrict domain cert namespace
		"!nameConstraints": {
			constraintType: "permitted",
			value: {
				sanType: "DNS",
				value: ".unused.invalid"
			}
		}
	}
}

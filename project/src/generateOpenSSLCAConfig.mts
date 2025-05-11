import {
	type DistinguishedNamePolicy,
	generateDistinguishedNamePolicySection
} from "@aniojs/node-openssl-config-gen"
import {resolvePathSync} from "@aniojs/node-fs"

export function generateOpenSSLCAConfig(
	_caDir: string,
	distinguishedNamePolicy: DistinguishedNamePolicy
): string {
	const caHomeDir = resolvePathSync(_caDir)

	let config = ``

	config += `[ca]\n`
	config += `default_ca = my_ca\n`

	config += `[my_ca]\n`
	config += `certificate = ${caHomeDir}/ca.crt\n`
	config += `private_key = ${caHomeDir}/ca.key\n`
	config += `new_certs_dir = ${caHomeDir}/certs\n`
	config += `serial = ${caHomeDir}/db/crt.srl\n`
	config += `crlnumber = ${caHomeDir}/db/crl.srl\n`
	config += `database = ${caHomeDir}/db/ca.db\n`
	config += `rand_serial = yes\n`
	config += `unique_subject = yes\n`
	config += `policy = my_ca_naming_policy\n`
	config += `email_in_dn = no\n`
	config += `preserve = no\n`
	config += `name_opt = multiline,-esc_msb,utf8\n`
	config += `cert_opt = ca_default\n`
	config += `copy_extensions = none\n`
	config += `crl_extensions = my_crl_extensions\n`

	config += `[my_crl_extensions]\n`
	config += `authorityKeyIdentifier = keyid:always\n`

	config += `[my_ca_naming_policy]\n`
	config += generateDistinguishedNamePolicySection(distinguishedNamePolicy)

	return config
}

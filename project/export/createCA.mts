import type {CreateCAOptions} from "./CreateCAOptions.mts"
import type {CA} from "./CA.mts"
import {isDirectorySync, writeAtomicFileSync} from "@aniojs/node-fs"
import {mkdirSync} from "node:fs"
import path from "node:path"

export function createCA(
	caHomeDir: string,
	options: CreateCAOptions
): CA {
	if (isDirectorySync(caHomeDir)) {
		throw new Error(`CA directory '${caHomeDir}' already exists.`)
	}

	const mkdirOptions = {mode: 0o700, recursive: false}

	mkdirSync(caHomeDir, mkdirOptions)
	mkdirSync(path.join(caHomeDir, "certs"), mkdirOptions)
	mkdirSync(path.join(caHomeDir, "db"), mkdirOptions)

	writeFile("ca.key", options.privateKey.value)
	writeFile("ca.crt", options.certificate)

	writeFile("db/crt.srl", "01\n")
	writeFile("db/crl.srl", "01\n")

	writeFile("db/ca.db", "")

	return {
		homeDir: caHomeDir
	}

	function writeFile(p: string, contents: string) {
		writeAtomicFileSync(
			path.join(caHomeDir, p), contents, {
				createParents: false,
				mode: 0o600
			}
		)
	}
}

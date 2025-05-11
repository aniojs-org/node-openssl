import {tmpfileSync} from "@aniojs/node-fs"
import {chmodSync, writeFileSync} from "node:fs"

export function secureTemporaryFile(
	content?: string|undefined,
	fileExtension?: string|undefined
) {
	const tmpFilePath = tmpfileSync(fileExtension)

	chmodSync(tmpFilePath, 0o600)

	writeFileSync(tmpFilePath, content ?? "", {
		mode: 0o600
	})

	return tmpFilePath
}

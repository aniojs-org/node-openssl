import type {PrivateKey} from "./PrivateKey.mts"
import type {PrivateKeyPassphraseSource} from "./PrivateKeyPassphraseSource.mts"
import {_isValidPassphraseSource} from "#~src/_isValidPassphraseSource.mts"
import fs from "node:fs"

export function loadPrivateKeyFromDisk(
	src: string,
	pkPassphraseSource?: PrivateKeyPassphraseSource|undefined
): PrivateKey {
	return {
		value: fs.readFileSync(src).toString(),
		// todo: detect, don't rely on pkPassphraseSource
		isEncrypted: _isValidPassphraseSource(pkPassphraseSource),
		passphraseSource: pkPassphraseSource ?? "none"
	}
}

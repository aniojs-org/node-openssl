import type {PrivateKeyPassphraseSource} from "#~export/PrivateKeyPassphraseSource.mts"
import type {_ValidPassphraseSource} from "./_ValidPassphraseSource.mts"

export function _isValidPassphraseSource(
	source: PrivateKeyPassphraseSource|undefined
): source is _ValidPassphraseSource {
	if (source === "none" || typeof source === "undefined") {
		return false
	}

	return true
}

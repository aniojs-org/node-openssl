import type {PrivateKeyPassphraseSource} from "#~export/PrivateKeyPassphraseSource.mts"
import type {_ValidPassphraseSource} from "./_ValidPassphraseSource.mts"

export function _isValidPassphraseSource(
	source: PrivateKeyPassphraseSource
): source is _ValidPassphraseSource {
	return source !== "none"
}

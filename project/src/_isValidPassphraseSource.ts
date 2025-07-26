import type {PrivateKeyPassphraseSource} from "#~export/PrivateKeyPassphraseSource.ts";
import type {_ValidPassphraseSource} from "./_ValidPassphraseSource.ts"

export function _isValidPassphraseSource(
	source: PrivateKeyPassphraseSource
): source is _ValidPassphraseSource {
	return source !== "none"
}

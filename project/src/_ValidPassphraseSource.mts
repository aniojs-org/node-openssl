import type {PrivateKeyPassphraseSource} from "#~export/PrivateKeyPassphraseSource.mts"

export type _ValidPassphraseSource = Exclude<
	PrivateKeyPassphraseSource,
	"none"
>

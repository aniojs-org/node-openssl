import type {PrivateKeyPassphraseSource} from "#~export/PrivateKeyPassphraseSource.ts"

export type _ValidPassphraseSource = Exclude<
	PrivateKeyPassphraseSource,
	"none"
>

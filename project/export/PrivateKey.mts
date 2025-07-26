import type {PrivateKeyPassphraseSource} from "./PrivateKeyPassphraseSource.mts"

export type PrivateKey = {
	value: string
	isEncrypted: boolean
	passphraseSource: PrivateKeyPassphraseSource|undefined
}

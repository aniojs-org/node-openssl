import type {SignedCertificate} from "./SignedCertificate.mts"
import type {PrivateKey} from "./PrivateKey.mts"

export type CreateCAOptions = {
	certificate: SignedCertificate
	privateKey: PrivateKey
}

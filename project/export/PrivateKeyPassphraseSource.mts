export type PrivateKeyPassphraseSource = "none" | {
	kind: "file"
	filePath: string
} | {
	kind: "prompt"
}

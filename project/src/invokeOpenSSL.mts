import {spawnSync} from "node:child_process"

export function invokeOpenSSL(args: string[]) {
	const child = spawnSync("openssl", args, {
		stdio: ["inherit", "pipe", "pipe"]
	})

	if (child.status !== 0) {
		throw new Error(
			`Failed to run command with args ${JSON.stringify(args, null, 4)}.\n\n` +
			`Standard Output:\n\n` +
			`${child.stdout.toString()}\n\n` +
			`${"=".repeat(80)}\n` +
			`Standard Error:\n\n` +
			`${child.stderr.toString()}\n\n`
		)
	}
}

import type { ClineMessage } from "@shared/ExtensionMessage"

interface CommitContext {
	files: string[]
	changes: string[]
	task?: string
}

const indonesianCommitTemplates = {
	feat: {
		prefix: "feat",
		description: "Fitur baru",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `tambah ${context.task || "fitur baru"}: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	fix: {
		prefix: "fix",
		description: "Perbaikan bug",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `perbaiki ${context.task || "bug"}: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	docs: {
		prefix: "docs",
		description: "Dokumentasi",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `perbarui dokumen: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	style: {
		prefix: "style",
		description: "Perubahan gaya kode",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `perbarui gaya kode: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	refactor: {
		prefix: "refactor",
		description: "Restrukturisasi kode",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `restrukturisasi ${context.task || "kode"}: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	test: {
		prefix: "test",
		description: "Pengujian",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `tambah pengujian: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	chore: {
		prefix: "chore",
		description: "Pemeliharaan",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `pemeliharaan: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
	custom: {
		prefix: "custom",
		description: "Kustom",
		template: (context: CommitContext) => {
			const fileList = context.files.length > 0 ? context.files.join(", ") : "tidak ada file"
			return `${context.task || "perbarui"}: ${context.changes.join(", ")}\n\nFile: ${fileList}`
		},
	},
}

export function generateIndonesianCommitMessage(messages: ClineMessage[], customInstruction?: string): string {
	// Extract context from messages
	const fileChanges: string[] = []
	const modifiedFiles: string[] = []

	for (const message of messages) {
		if (message.say === "text" && message.text) {
			// Look for file operations in the message
			const fileMatch = message.text.match(/(?:edit|create|delete|modify|update)\s+([^\s\n]+)/gi)
			if (fileMatch) {
				fileChanges.push(...fileMatch.slice(1))
			}

			// Extract file names from tool results
			const toolResults = message.text.match(/(?:file|edit|create|write).*?:\s*([^\s\n]+)/gi)
			if (toolResults) {
				modifiedFiles.push(...toolResults.slice(1))
			}
		}
	}

	const context: CommitContext = {
		files: [...new Set(modifiedFiles)],
		changes: [...new Set(fileChanges)],
		task: extractTaskFromMessages(messages),
	}

	// If custom instruction is provided, use it
	if (customInstruction && customInstruction.trim()) {
		return indonesianCommitTemplates.custom.template({
			...context,
			task: customInstruction.trim(),
		})
	}

	// Auto-detect commit type based on message content
	const commitType = detectCommitType(messages)

	if (commitType && indonesianCommitTemplates[commitType as keyof typeof indonesianCommitTemplates]) {
		return indonesianCommitTemplates[commitType as keyof typeof indonesianCommitTemplates].template(context)
	}

	// Default to feat if no specific type detected
	return indonesianCommitTemplates.feat.template(context)
}

function detectCommitType(messages: ClineMessage[]): string | null {
	const messageText = messages
		.map((m) => m.text || "")
		.join(" ")
		.toLowerCase()

	// Check for keywords to determine commit type
	if (messageText.includes("fix") || messageText.includes("bug") || messageText.includes("error")) {
		return "fix"
	}
	if (messageText.includes("test") || messageText.includes("testing")) {
		return "test"
	}
	if (messageText.includes("refactor") || messageText.includes("restructure") || messageText.includes("cleanup")) {
		return "refactor"
	}
	if (messageText.includes("doc") || messageText.includes("readme") || messageText.includes("documentation")) {
		return "docs"
	}
	if (messageText.includes("style") || messageText.includes("format") || messageText.includes("lint")) {
		return "style"
	}
	if (messageText.includes("chore") || messageText.includes("maintain") || messageText.includes("update")) {
		return "chore"
	}

	return null
}

function extractTaskFromMessages(messages: ClineMessage[]): string {
	// Try to extract the main task from the conversation
	for (const message of messages) {
		if (message.say === "task") {
			return message.text || ""
		}
	}

	// If no explicit task, look for key actions in the first few messages
	const recentMessages = messages.slice(0, 5).reverse()
	for (const message of recentMessages) {
		if (message.say === "text" && message.text) {
			const text = message.text.toLowerCase()
			if (text.includes("create") || text.includes("tambah") || text.includes("buat")) {
				return "tambah fitur"
			}
			if (text.includes("implement") || text.includes("build")) {
				return "implementasi fitur"
			}
			if (text.includes("fix") || text.includes("perbaiki")) {
				return "perbaikan bug"
			}
			if (text.includes("update") || text.includes("perbarui")) {
				return "perbarui fitur"
			}
		}
	}

	return "perubahan kode"
}

export { indonesianCommitTemplates, type CommitContext }

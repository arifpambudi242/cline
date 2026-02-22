import { McpDisplayMode, UpdateSettingsRequest } from "@shared/proto/cline/state"
import { StateServiceClient } from "@/services/grpc-client"

// Features that are not available for free users
const PREMIUM_FEATURES = new Set([
	"subagentsEnabled",
	"clineWebToolsEnabled",
	"worktreesEnabled",
	"focusChainEnabled",
	"yoloModeToggled",
	"doubleCheckCompletionEnabled",
	"enableCheckpointsSetting",
])

/**
 * Converts values to their corresponding proto format
 * @param field - The field name
 * @param value - The value to convert
 * @returns The converted value
 * @throws Error if the value is invalid for the field
 */
const convertToProtoValue = (field: keyof UpdateSettingsRequest, value: any): any => {
	if (field === "mcpDisplayMode" && typeof value === "string") {
		switch (value) {
			case "rich":
				return McpDisplayMode.RICH
			case "plain":
				return McpDisplayMode.PLAIN
			case "markdown":
				return McpDisplayMode.MARKDOWN
			default:
				throw new Error(`Invalid MCP display mode value: ${value}`)
		}
	}
	return value
}

/**
 * Updates a single field in the settings.
 *
 * @param field - The field key to update
 * @param value - The new value for the field
 */
export const updateSetting = (field: keyof UpdateSettingsRequest, value: any) => {
	// Check if trying to enable a restricted feature
	if (PREMIUM_FEATURES.has(field) && value === true) {
		console.warn(`Feature "${field}" is not available`)
		return
	}

	const updateRequest: Partial<UpdateSettingsRequest> = {}

	const convertedValue = convertToProtoValue(field, value)
	updateRequest[field] = convertedValue

	StateServiceClient.updateSettings(UpdateSettingsRequest.create(updateRequest)).catch((error) => {
		console.error(`Failed to update setting ${field}:`, error)
	})
}

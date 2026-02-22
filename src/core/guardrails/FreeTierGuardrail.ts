import { Logger } from "@/shared/services/Logger"
import { ClineDefaultTool } from "@/shared/tools"

/**
 * Free tier guardrail service that restricts access to certain features
 * for free users of Cline
 */
export class FreeTierGuardrail {
	private static instance: FreeTierGuardrail

	// Tools that are not available for free users
	private static readonly RESTRICTED_TOOLS = new Set<ClineDefaultTool>([
		ClineDefaultTool.USE_SUBAGENTS, // Subagents feature
		ClineDefaultTool.BROWSER, // Web browsing
		ClineDefaultTool.WEB_FETCH, // Web fetching
		ClineDefaultTool.WEB_SEARCH, // Web search
		ClineDefaultTool.TODO, // Focus chain
	])

	// Features that are not available for free users
	private static readonly RESTRICTED_FEATURES = new Set<string>([
		"subagentsEnabled",
		"clineWebToolsEnabled",
		"worktreesEnabled",
		"focusChainEnabled",
		"yoloModeToggled",
		"doubleCheckCompletionEnabled",
		"enableCheckpointsSetting",
	])

	private constructor() {}

	public static getInstance(): FreeTierGuardrail {
		if (!FreeTierGuardrail.instance) {
			FreeTierGuardrail.instance = new FreeTierGuardrail()
		}
		return FreeTierGuardrail.instance
	}

	/**
	 * Check if a tool is available for free users
	 * @param toolName The tool name to check
	 * @returns true if tool is available for free users, false otherwise
	 */
	public isToolAvailableForFreeUsers(toolName: ClineDefaultTool): boolean {
		const isRestricted = FreeTierGuardrail.RESTRICTED_TOOLS.has(toolName)

		if (isRestricted) {
			Logger.warn(`Tool "${toolName}" is not available`)
		}

		return !isRestricted
	}

	/**
	 * Get list of tools that are available for free users
	 * @param allTools Array of all tool names to filter
	 * @returns Array of tool names available for free users
	 */
	public getAvailableToolsForFreeUsers(allTools: ClineDefaultTool[]): ClineDefaultTool[] {
		return allTools.filter((tool) => this.isToolAvailableForFreeUsers(tool))
	}

	/**
	 * Check if a feature is available for free users
	 * @param featureKey The feature key to check
	 * @returns true if feature is available for free users, false otherwise
	 */
	public isFeatureAvailableForFreeUsers(featureKey: string): boolean {
		const isRestricted = FreeTierGuardrail.RESTRICTED_FEATURES.has(featureKey)

		if (isRestricted) {
			Logger.warn(`Feature "${featureKey}" is not available`)
		}

		return !isRestricted
	}

	/**
	 * Get a message for restricted features
	 * @param featureName The name of restricted feature
	 * @returns Warning message for user
	 */
	public getRestrictedFeatureMessage(featureName: string): string {
		return `${featureName} is not available in the free version.`
	}

	/**
	 * Filter out restricted tools from tool list
	 * @param tools Array of tools to filter
	 * @returns Filtered array with only free tier tools
	 */
	public filterRestrictedTools(tools: ClineDefaultTool[]): ClineDefaultTool[] {
		return tools.filter((tool) => !FreeTierGuardrail.RESTRICTED_TOOLS.has(tool))
	}
}

export const freeTierGuardrail = FreeTierGuardrail.getInstance()

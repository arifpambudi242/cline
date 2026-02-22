import { useExtensionState } from "@/context/ExtensionStateContext"
import ApiOptions from "../ApiOptions"
import Section from "../Section"

interface ApiConfigurationSectionProps {
	renderSectionHeader?: (tabId: string) => JSX.Element | null
	initialModelTab?: "free"
}

const ApiConfigurationSection = ({ renderSectionHeader, initialModelTab }: ApiConfigurationSectionProps) => {
	const { apiConfiguration } = useExtensionState()
	return (
		<div>
			{renderSectionHeader?.("api-config")}
			<Section>
				<ApiOptions currentMode="act" initialModelTab={initialModelTab} showModelOptions={true} />
			</Section>
		</div>
	)
}

export default ApiConfigurationSection

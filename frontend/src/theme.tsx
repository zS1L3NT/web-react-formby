import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
	initialColorMode: "light",
	useSystemColorMode: false,
	fonts: {
		heading: "Raleway, sans-serif",
		body: "Raleway, sans-serif"
	},
	sizes: {
		min: "0%",
		max: "100%"
	},
	semanticTokens: {
		colors: {
			primary: {
				_light: "blue.500",
				_dark: "blue.400"
			},
			primaryDark: {
				_light: "blue.400",
				_dark: "blue.300"
			},
			background: {
				_light: "gray.100",
				_dark: "gray.900"
			},
			card: {
				_light: "white",
				_dark: "gray.800"
			},
			error: "red.500",
			text: {
				_light: "gray.700",
				_dark: "gray.200"
			},
			highlight: "gray.100"
		}
	},
	components: {
		Text: {
			baseStyle: {
				color: "gray.500",
				fontWeight: "medium",
				fontSize: {
					base: "md",
					sm: "lg",
					md: "xl"
				}
			},
			variants: {
				inputError: {
					color: "error",
					fontSize: "sm"
				}
			}
		},
		Button: {
			variants: {
				primary: {
					bg: "primaryDark",
					color: "white",
					_hover: {
						bg: "primary !important"
					}
				}
			}
		}
	}
})

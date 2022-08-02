import { createContext, PropsWithChildren, useState } from "react"

import { useLazyGetUserQuery } from "../api"
import useAsyncEffect from "../hooks/useAsyncEffect"
import { iUser } from "../models/User"

const AuthContext = createContext<{
	user: iUser | null
	token: string | null
	setToken: (token: string | null) => void
}>({
	user: null,
	token: null,
	setToken: () => {}
})

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [getUser, { data: user }] = useLazyGetUserQuery()

	const [token, setToken] = useState<string | null>(localStorage.getItem("token"))

	useAsyncEffect(async () => {
		if (token) {
			const { error } = await getUser({ token })

			if (error) {
				setToken(null)
				localStorage.removeItem("token")
			}
		}
	}, [token])

	const setTokenAndLocalStorage = (token: string | null) => {
		if (token) {
			localStorage.setItem("token", token)
		} else {
			localStorage.removeItem("token")
		}

		setToken(token)
	}

	return (
		<AuthContext.Provider
			value={{
				user: token ? user ?? null : null,
				token,
				setToken: setTokenAndLocalStorage
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext

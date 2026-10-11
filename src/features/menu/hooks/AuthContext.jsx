import { createContext, useContext, useState } from 'react'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
 const [session, setSession] = useState(null)
 return <AuthContext.Provider value={{ session, setSession }}>{children}</AuthContext.Provider>
}
// Keep the token in memory; refresh signs the user out.
// oxlint-disable-next-line react/only-export-components
export function useAuth() { return useContext(AuthContext) }

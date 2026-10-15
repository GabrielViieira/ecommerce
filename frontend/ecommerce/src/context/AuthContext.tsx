import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { validateToken } from "../services/APIservice"


interface AuthContextType {
  user: any
  setUser: (user: any) => void
}

type User = {
  _id: string,
  username: string,
  email: string,
  birth: string,
  roles: [string]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const recoverUser = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          const data = await validateToken()
          setUser(data)
        } catch (error) {
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    recoverUser()
  }, [])

  useEffect(() => {
    const tempoEmMs = 60 * 60 * 1000

    const timer = setTimeout(() => {
      alert("Sessão expirada faço login novamente!")
      localStorage.removeItem('token')
      window.location.href = '/'
    }, tempoEmMs)

    return () => clearTimeout(timer)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}


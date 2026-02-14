import { createContext, useContext, useState} from "react";
const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const login = (token)=>{
        localStorage.setItem("token",token);
        setToken(token);
    };
    const logout = ()=>{
        localStorage.clear();
        setToken(null);
    };
    return(
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = ()=>useContext(AuthContext);
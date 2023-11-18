import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosConfig/TalkWaveDB";

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
    const [name, setName] = useState(null);
    // const [isLogged, setIsLogged] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        axiosInstance.get('/users/profile').then((response) =>{
            // console.log(response.data);
            setId(response.data.userId);
            setName(response.data.username);
            // setIsLogged(true);
        });
    },[])
    return (
        <UserContext.Provider value={{ name, setName, id, setId}}>
            {children}
        </UserContext.Provider>
    );
}
import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "./firebase";
import Router from "next/router";

const authContext = createContext();

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleUser = (rawUser) => {
        if (rawUser) {
            const user = formatUser(rawUser);

            setLoading(false);
            setUser(user);
            return user;
        }
    };

    const signInWithGitHub = () => {
        setLoading(true);
        return firebase
            .auth()
            .signInWithPopup(new firebase.auth.GithubAuthProvider())
            .then((response) => handleUser(response.user));
    };

    const signout = () => {
        return firebase
            .auth()
            .signOut()
            .then(() => handleUser(false));
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

        return () => unsubscribe;
    }, []);

    return {
        user,
        loading,
        signInWithGitHub,
        signout,
    };
}

const formatUser = (user) => {
    return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        photoUrl: user.photoURL,
    };
};

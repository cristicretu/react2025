import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { AuthProvider } from "../lib/auth";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default MyApp;

import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

    html {
        font-size: 16px;
        @media (max-width: 768px) {
            font-size: 10px;
        }
    }
    * {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
    }

    div.app {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        /* background-color: ${props => props.theme.dark_light}; */
    }
    div.app.blur {
        filter: blur(2px);
        opacity: 0.5;
        overflow: hidden;
    }

    .break-word {
        word-break: break-word;    
    }  

    ::-webkit-scrollbar {
        width: 10px;
        background-color: #fff;
    }
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    ::-webkit-scrollbar-thumb {
        background: #4472CA;
        border-radius: 10px;
    }
`
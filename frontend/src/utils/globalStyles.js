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
    }

    .break-word {
        word-break: break-word;    
    }  
`
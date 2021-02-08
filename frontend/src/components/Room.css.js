import styled from 'styled-components';

export const Wrapper = styled.div`
    height: 100%;
`;

export const Header = styled.div`
    box-sizing: border-box;
    display: flex;
    background-color: ${props => props.theme.dark_light};
    width: 100%;
    height: 100px;
    color: #fff;
    padding: 10px;
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);

    & > div:nth-child(1) {
        flex-basis: 80%;
    }


    & > div:nth-child(2) {
        flex-basis: 20%;
    }

`;

export const Containter = styled.div`
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);
    height: 70%;
    overflow-y: scroll;
`

export const MessageContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: ${props => props.gray ? "flex-end" : "flex-start"};
`;

export const Message = styled.div`
    display: flex;
    box-sizing: border-box;
    padding: 5px;
    margin: 5px 10px;
    color: #fff;
    width: auto;
    max-width: 60%;

    @media (max-width: 900px) {
        max-width: 70%;
        margin: 5px 2px;

    }
`;

export const MessageIcon = styled.div`
    width: 64px;
    height: 64px;
    background-color: ${props => props.gray ? "#808080" : props => props.theme.dark_light};
    border-radius: 50%;
    margin: 5px;
    flex-shrink: 0;
    @media (max-width: 900px) {
        width: 46px;
        height: 46px;   
    }
`

export const MessageText = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
    background-color: ${props => props.gray ? "#808080" : props => props.theme.dark_light};
    border-radius: 10px;
    padding: 10px;
    width: 100%;
    min-width: 0;
    /* max-width: calc(100% - 94px); // 64 + plus margin, padding */
    flex-grow: 0;
    /* flex-grow:1; */
    word-wrap: break-word;
    
    @media (max-width: 900px) {
        max-width: 300px;
    }
    @media (max-width: 576px) {
        max-width: 200px;
    }
    

`

export const Author = styled.p`
    display: block;
    text-align: ${props => props.gray ? "end" : "start"};
    font-weight: 600;
    letter-spacing: 1.2px;
`;

export const InputContainer = styled.div`
    display: flex;
    height: calc(30% - 100px);
    background-color: ${props => props.theme.dark_light};
    padding: 0px 10px;
    justify-items: center;
    align-items: center;

    & > div:nth-child(1) {
        flex-basis: 70%;
    }
    & > div:nth-child(2) {
        flex-basis: 30%;
    }
`
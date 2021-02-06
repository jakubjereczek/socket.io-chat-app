import styled from 'styled-components';

export const Title = styled.p`
    padding-left: 5px;
    font-size: ${props => props.small ? "1.5rem" : "3rem"};
    color: #808080;
`

export const Input = styled.input`
    padding: 15px 10px;
    font-size: 3rem;
    border: 1px solid #808080;
    border-radius: 10px;
    margin: 5px 0;
    color: #808080;
`

export const Button = styled.button`
    width: 100%;
    background-color: ${props => props.theme.dark_light};
    padding: 10px 10px;
    border: 0;
    font-size: ${props => props.small ? "1.3rem" : "1.6rem"};
    color: #fff;
    border-radius: 10px;
`

export const MainWrapper = styled.div`
    width: 950px;
`

export const TitleBold = styled.p`
    font-weight: 600;
    font-size: ${props => props.small ? "1.3rem" : "2rem"};
    margin: 0 5px;
`;

export const TitleThin = styled.p`
    font-weight: 200;
    font-size: ${props => props.small ? "1.3rem" : "2rem"};
    margin: 0 5px;

    & > span {
        font-weight:300;
    }
    word-break: break-word;    
`;


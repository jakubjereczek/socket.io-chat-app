import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: ${props => props.theme.dark_light};
    height: 100%;
    width: 100%;
`

export const WrapperInside = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    height: 60%;
`;

export const Title = styled.h2`
    font-size: 3rem;
    color: #fff;
`

export const Input = styled.input`
    padding: 20px 10px;
    font-size: 3rem;
`

export const Button = styled.button`
    background-color: ${props => props.theme.light};
    padding: 20px 10px;
    border: 0;
    font-size: 2.4rem;
    color: #fff;
`
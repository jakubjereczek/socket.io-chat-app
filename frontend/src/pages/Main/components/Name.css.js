import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    //background-color: ${props => props.theme.light};
    background-color: #fff;
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


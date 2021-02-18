import styled from 'styled-components';

export const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    min-height:100%;
    z-index: 1;
`

export const Container = styled.div`
    position: absolute;
    left: calc(50% - 450px);
    top: calc(50% - 250px);
    width: 900px;
    height: 70%;
    background-color: #fff;
    border: 2px solid ${props => props.theme.dark_light};
    border-radius: 10px;
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);

    @media (max-width: 900px) {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }
`
export const TitlePopup = styled.h2`
    width: 900px;
    position: absolute;
    left: calc(50% - 450px);
    top: -40px;
    font-size: 3rem;
    text-align: center;
    @media (max-width: 900px) {
        width: calc(100% - 46px);
        position: relative;
        left: 0;
        top: 0;
    }
`

export const ReturnButton = styled.div`
    position: absolute;
    top: 4px;
    left: calc(100% - 50px);
    width: 46px;
    height: 46px;
    vertical-align: middle;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #000;
    display: flex;
    align-items: center;
    & > span {
        display: flex;
        justify-content: center;
        flex-grow:1;
        align-items: center;
        & > * {
            display: block;
        }
        transition: .6s;

        &:hover {
            transform: translate(0,-5px) scale(1.05);
        }
    }

`;

export const Content = styled.div`
    margin: 10px;
    margin-top: 50px;
    overflow: hidden;
    @media (max-width: 900px) {
        margin-top: 10px;
    }
`;
import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 10px 0;
    height: 10%;
    max-height: 100px;

    & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 2.4rem;
        flex-basis: 100%;
        margin: 0px 5px;
    }

    & ~ div {
        width: 100%;
    }
`

export const HeaderWrapper = styled.div`
    width: 100%;
`;

export const DescribeWrapper = styled.div`
    text-align: center;
    margin: 20px 0px;

    & > p {
        font-size: 1.4rem;
        color: #808080;
    }
`
import styled from 'styled-components';

export const ListWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

export const ListElement = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-basis: 45%;
    //max-width: 450px;
    min-width: 200px;
    border: 1px solid #808080;
    border-radius: 10px;
    padding: 5px;
    margin: 10px;
    flex-grow: 1;
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);

    & > div:nth-child(2) {
        margin-top: 10px;
    }
`;
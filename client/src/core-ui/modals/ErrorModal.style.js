import styled from "styled-components";

export const StyledErrorModal = styled.div`
position: fixed;
top: 8px;
left: 50%;
border-radius: 8px;
border: white 1px solid;

display: flex;
align-items: center;
justify-content: center;


background-color: #FF4C41;
padding: 12px 12px 12px 12px;
min-width: 300px;

img {
    margin-right: 24px;
}

div {
    color: black;
    
}

transform: ${(props)=> props.isShown ? "translate(-50%,0)" : "translate(-50%,-20px)"};
opacity: ${props => props.isShown ? "100%" : "0%"};
visibility: ${props => props.isShown ? "" : "hidden"};
`
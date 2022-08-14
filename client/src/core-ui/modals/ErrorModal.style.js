import styled from "styled-components";

export const StyledErrorModal = styled.div`
position: fixed;
top: 8px;
left: 50%;
z-index: 150;

display: flex;
align-items: center;
justify-content: center;

padding: 12px 12px 12px 12px;
min-width: 300px;
border-radius: 8px;
border: white 1px solid;

background-color: #FF4C41;


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
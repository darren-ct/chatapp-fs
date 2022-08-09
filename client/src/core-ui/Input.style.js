import styled from "styled-components";

export const StyledInput = styled.div`
     display: flex;
     flex-direction: column;
     margin-bottom: 24px;

     input {
        padding: ${(props)=> props.styling === "outline" ? "4px 0px" : "12px 8px"};
        border-radius: 4px;
        background-color: ${(props)=> props.styling === "outline" ? "transparent" : "#ECF1F4"};
        border: ${(props)=> props.styling === "outline" ? "1px solid transparent" : "none"};
        border-bottom-color:${(props)=> props.styling === "outline" ? "#3C2CB4" : "#transparent"};
        color:#0D0D0D;
        outline: none;
        appearance: none;
        margin-bottom: 8px;
        font-size: 16px;
        width: 100%;
     } 

     p {
        color: #FF4C41;
        font-size: 12px;
     }
`
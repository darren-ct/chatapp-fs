import styled from "styled-components";

export const StyledDropdown = styled.div`
min-width: 170px;
cursor: default;

position: absolute;
top:100%;
right:0px;
z-index: 10;

background-color: white;
box-shadow:1px 1px 8px  rgba(108,92,231,.25) ;
padding: 12px 18px;

display: flex;
flex-direction: column;
align-items: flex-start;

border: 1px solid rgba(108,92,231,.75);
border-radius: 8px;

span{
    cursor: pointer;

    text-align: left;
    margin-bottom: 8px ;
    
    color: rgba(108,92,231,.55);
    transition: 150ms ease;

    &:hover{
        color:rgba(108,92,231,1);
    }
}
`
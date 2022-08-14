import styled from "styled-components";

export const StyledNotificationModal = styled.div`
position: fixed;
top: 8px;
left: 50%;
z-index: 150;

display: flex;
align-items: center;
justify-content: center;

min-width: 300px;
padding: 12px 12px 12px 12px;
border-radius: 8px;
border: white 1px solid;

background-color: #67FF92;

.success { margin-right: 24px;}
.notif{ font-size: 18px;}
    
transform: ${(props)=> props.isShown ? "translate(-50%,0)" : "translate(-50%,-100px)"};
opacity: ${props => props.isShown ? "100%" : "0%"};
visibility: ${props => props.isShown ? "" : "hidden"};
`
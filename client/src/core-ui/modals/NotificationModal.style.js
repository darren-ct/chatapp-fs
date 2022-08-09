import styled from "styled-components";

export const StyledNotificationModal = styled.div`
position: fixed;
top: 8px;
left: 50%;

border-radius: 8px;
border: white 1px solid;

display: flex;
align-items: center;
justify-content: center;


background-color: #67FF92;
padding: 12px 12px 12px 12px;
min-width: 300px;



    .success {
    margin-right: 24px;
    
}

    .notif{
        font-size: 18px;
        
    }
    


transform: ${(props)=> props.isShown ? "translate(-50%,0)" : "translate(-50%,-100px)"};
opacity: ${props => props.isShown ? "100%" : "0%"};
visibility: ${props => props.isShown ? "" : "hidden"};
`
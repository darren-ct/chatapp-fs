import styled from "styled-components";

export const StyledChatBoxCards = styled.div`
    position: relative;
    padding: 28px 20px 20px 20px;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid rgba(108,92,231,.2);
    transition: 150ms ease;

    &:hover{
        border: 1px solid rgba(108,92,231,.6);
    }

    img{
        width: 68px;
        height: 68px;
        object-fit: cover;
        margin-right: 36px;
        border:1px solid transparent;
        border-radius: 100vw;
        background: rgba(217,217,217,.5);
    };

    .name{
        flex: 1;
        font-weight: bold;
        font-size: 18px;
        color: #6C5CE7;
    }

    .time{
        position: absolute;
        font-size: 14px;
        color : rgba(108,92,231,.75);
        top: 4px;
        right: 24px;
    }

    .notif{
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 14px;
         padding: 12px 19px ;
         border-radius: 100vh;
         background-color: #67FF92;
    }


`
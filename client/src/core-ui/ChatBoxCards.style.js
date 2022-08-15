import styled from "styled-components";

export const StyledChatBoxCards = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    padding: 28px 20px 20px 20px;
    width: 100%;

    cursor: pointer;

    border: ${(props)=> props.isMe ? "2px solid rgba(108,92,231,.8)" : "1px solid rgba(108,92,231,.1)"};
    transition: 150ms ease;

    &:hover{
        border: 1px solid rgba(108,92,231,.8);
    };

    .status-dot{
       bottom: 20px;
       left: 70px;
       position: absolute;

       width: 16px;
       height: 16px;

       border-radius:100vh;
       background-color: #D3CCCC;
    };

    .status-dot.online {
        background-color: #67FF92;
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

    .pin{
        left: 25px;
        bottom: 20px;
        position: absolute;

        width: 20px;
        height: 20px;
        margin-right: 0px;

        border:0px solid transparent;
        border-radius: 0px;
        background: transparent;
    }

    .name{
        flex: 1;
        font-weight: bold;
        font-size: 18px;
        color: #6C5CE7;
    };

    .time{
        position: absolute;

        top: 4px;
        right: 24px;

        font-size: 14px;
        color : rgba(108,92,231,.75);
    };

    .notif{
         display: flex;
         align-items: center;
         justify-content: center;

         font-size: 14px;
         padding: 12px 19px ;
         
         border-radius: 100vh;
         background-color: #67FF92;
    };


`
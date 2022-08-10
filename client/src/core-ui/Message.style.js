import styled from "styled-components";

export const StyledMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${(props)=> props.isMe ? "flex-end" : "flex-start" };
    margin-bottom: 24px;
    padding-right: 24px;
    padding-left: 24px;
    padding-top: 24px;

    .message-profile{
        border-radius:100vh;
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 24px;
    }

    .message-part{
        display: flex;
        flex-direction: column;

        .message-body{
           min-width: 216px;
           max-width: 280px;
           position: relative;
           background-color: ${(props)=>props.isMe?"#6C5CE7":"transparent"};
           border: 1px solid #6C5CE7;
           border-radius: 4px;
           padding: 12px 40px 14px 24px ;
           cursor: pointer;

           .triangle{
               background-color:${(props)=>props.isMe? "#6c5ce7" : "white"};
               border: 1px solid;
               border-color:${(props)=>props.isMe? "#6c5ce7" : "white"};;
               position: absolute;
               left: ${(props)=>props.isMe ? "100%" : "-10px"};
               top: calc(50% - 4px);
               width: 12px;
               height: 12px;
               transform: ${(props)=>props.isMe ? "rotate(180deg)" : "rotate(0deg)"};
               clip-path: polygon(100% 0, 0 50%, 100% 100%);
                }

           .message-content{
            color: ${(props)=>props.isMe?"white":"#6c5ce7"};
            word-break: break-all;
           }

           .message-time{
              position: absolute;
              font-size: 14px;
              color: ${(props)=>props.isMe?"white":"rgba(108,92,231,.75)"};
              bottom: 2px;
              right: 8px;
           }
        };

        .message-info {
            margin-top: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                flex: 1;
                color: #6C5CE7;
                font-size: 10px;
                text-align: ${(props)=>props.isMe?"right":"left"};
                margin-right: 8px;
            }
        }
    }

    
`
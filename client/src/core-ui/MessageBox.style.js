import styled from "styled-components";

export const StyledMessageBox = styled.div`
     position: relative;
     flex: 1;
     display: flex;
     flex-direction: column;
     align-items: stretch;
     overflow-x: hidden;

     .empty-message{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-weight: bold;
        font-size: 28px;
     }

     .dynamic{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
     }

     header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 16px 24px;
        background-color: #6C5CE7;
        border-bottom: 1px solid rgba(108,92,231,.2);

        .msg-profile{
            cursor: pointer;
            width: 48px;
            height: 48px;
            border: 1px solid transparent;
            border-radius:100vh;
            object-fit: cover;
            background-color: rgba(217,217,217,.3);
            margin-right: 36px;

        };

        .msg-info{
            position: relative;
            flex: 1;

            .status-dot{
                position: absolute;
                background-color: #67FF92;
                width: 12px;
                height: 12px;
                border-radius: 100vh;
                bottom: 6px;
                left: -48px;
            };

            .msg-name{
               font-size: 24px;
               font-weight: bold;
               color: white;
            }

            .msg-status{
                color: white;
            }
        }

        .other-btn{
            cursor: pointer;
            width: 32px;
        }
     }

     .msg-section{
        flex:1;
        position: relative;
        max-height: 440px;
        overflow-y: scroll;
        -ms-overflow-style: none;  
         scrollbar-width: none;  
     }

     .msg-section::-webkit-scrollbar{
        display: none;
     }

     .msg-others{
        overflow-x: scroll;
     };

     .msg-tab{
        background-color: #6C5CE7;
        padding: 24px 24px 24px 32px ;
        display: flex;
        flex-direction: row;

        img{
            cursor: pointer;
            width: 32px;
            margin-right: 32px;
        }

        .msg-control{
            position: relative;
            flex: 1;

            input{
                width: 100%;
                padding: 16px 72px 16px 32px;
                border: none;
                outline: none;
                border-radius: 8px;
            }

            img{
                position: absolute;
                bottom: 10px;
                right: -8px;
                width: 32px;

            }
        }



     }
`
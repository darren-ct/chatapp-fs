import styled from "styled-components";

export const StyledChatBox = styled.div`
     position: relative;
     display: flex;
     flex-direction: column;
     width: 420px;
     height: 100vh;
     border: 1px solid rgba(108,92,231,.2);

     header{
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(108,92,231,.2);

        .chat-profile{
            cursor: pointer;

            width: 48px;
            height: 48px;

            border: 1px solid transparent;
            border-radius:100vh;

            margin-right: 208px;

            object-fit: cover;
            background-color: rgba(217,217,217,.3);
        };

        .add-btn{
            position: relative;
            border: none;
            background-color: transparent;
            appearance: none;
            margin-right: 54px;

            color:#6C5CE7 ;
            font-size: 36px;

            cursor: pointer;
        };

        .other-btn{
            width: 32px;
            cursor: pointer;
        }

     };

     .sort-section{
        display: flex;
        flex-direction: column;
        padding: 12px;

        .search-control{
            position: relative;
            margin-bottom: 8px;

            input{
                width: 100%;
                color: #858585;
                background-color: #F0EFFD;
                padding: 16px 48px 16px 24px;
                border: none;
                outline: none;
            }

            img {
               position: absolute;
               top: 18px;
               right: 24px;
            }
        }

        .filter-control{
            font-family: sans-serif;
            color: #6c5ce7;;
            border-color:transparent;
            background-color: transparent;
            width: 140px;
            cursor: pointer;

            select{
                font-family: 'Poppins';
                
            }

            option{
                font-family: 'Poppins';
               opacity: .5;
               background-color: white;
               cursor: pointer;
               border-color:transparent;
               
            }
        }
     }

     .chats-section{
        position: relative;
        flex: 1;

        border-top: 1px solid rgba(108,92,231,.2);

        overflow-y: scroll;
        -ms-overflow-style: none;  
        scrollbar-width: none;  
         
         .chats{
            display: flex;
            flex-direction: column;
            
            .empty-list{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);

            }
         }
     }

     .chats-section::-webkit-scrollbar{
        display: none;
     }


`
import styled from "styled-components";

export const StyledChatBox = styled.div`
     position: relative;
     display: flex;
     flex-direction: column;
     width: 420px;
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
            object-fit: cover;
            background-color: rgba(217,217,217,.3);
            margin-right: 208px;

        };

        .add-btn{
            border: none;
            background-color: transparent;
            appearance: none;
            color:#6C5CE7 ;
            font-size: 36px;
            margin-right: 54px;
            cursor: pointer;
            position: relative;
        };

        .other-btn{
            cursor: pointer;
            width: 32px;
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
        border-top: 1px solid rgba(108,92,231,.2);
        overflow-y: scroll;
        -ms-overflow-style: none;  
         scrollbar-width: none;  
         flex: 1;
         

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
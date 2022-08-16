import styled from "styled-components";

export const StyledUserCard = styled.div`
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
     margin-bottom: 8px;
     border: 1px solid rgba(108,92,231,.2);
     border-radius: 4px;
     
     padding: 24px;

     .left-side {
        display: flex;
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;

        img{
        margin-right: 12px;
        border-radius:100vw;
        width: 68px;
        height: 68px;
        background-color: gray;
        flex-shrink:0;
        object-fit: cover;
        };

        .left-text{
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: flex-start;

         .left-title{
            font-size: 18px;
            font-weight: bold;
            color:#3C2CB4;
            margin-bottom:8px;
         }

         .left-buttons{
            display: flex;
            justify-content: flex-start;

            button{
               margin-right: 10px ;
               font-size: 12px;
            };

            p{
               font-size: 12px;
               color : #3C2CB4;
            }

         }
        }

     }

    
`
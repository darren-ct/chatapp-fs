import styled from "styled-components";

const StyledFormBody = styled.div`
     background-color:white;
     border: 1px solid #C8C8C8;
     border-radius: 12px;

     width:416px;
     padding : 40px 32px 16px 32px;

     box-shadow: 3px 4px 4px 0 rgba(0, 0, 0, 0.25);


     button {
        margin-top: 8px;
        font-size: 18px;
        transition: 150ms ease;
        &:hover{
             transform: scale(1.1);
        }
     }

     .title {
        font-size: 32px;
        font-weight: bold;
        color: #3C2CB4;
        text-align: center;
     }

     .description {
        text-align: center;
        color: #3C2CB4;
        font-size: 14px;
        margin-bottom: 48px;
     }

     .link {
        position: relative;
        color: #3C2CB4;
        margin-top:4px;
        font-size: 12px;
        cursor: pointer;
        overflow-x: hidden;
        display: inline-block;

        &::after{
            content: "";
            background-color: #3C2CB4;
            position: absolute;
            height: 1px;
            width: 100%;
            bottom: 1px;
            right: 100%;
            transition: 300ms ease;

        }

        &:hover::after{
            transform: translateX(100%);
        }
     }

     #first-link{
         margin-top: 32px;
         margin-left: 190px;
     }

     #second-link{
      text-align: end;
      margin-top: 24px;
     }

     .timer {
      color: red;
      font-weight: bold;
      text-align: center;
      margin-bottom: 12px;
     }

     .digits{
      display: flex;
      margin-bottom: 32px;
      align-items: center;
      justify-content: center;
      margin-bottom: 48px;
      
      .digit {
         font-weight: bold;
         font-size: 24px;
         width: 48px;
         height: 48px;
         padding: 16px;
         border: none;
         background-color: rgba(236, 241, 244, 1);
         margin-right: 12px;
    
      }
     }

`
export default StyledFormBody;
import styled from "styled-components";

export const StyledConfirmModal = styled.div`
position: fixed;
z-index: 1000;
left: 0px;
top: 0px;

display: flex;
align-items: center;
justify-content: center;
width: 100vw;
height: 100vh;

background-color: rgba(0,0,0,.8);

.modal-body{
    padding: 64px;
    background-color: white;
    border-radius: 12px;

    span {
        margin: 0 auto;
        text-align: center;

        color: black;
        font-weight: bold;
        font-size: 24px;
    }
    .btn-group {
        margin-top: 24px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        button:first-child {
           margin-right: 8px;
        }
    }
}

`
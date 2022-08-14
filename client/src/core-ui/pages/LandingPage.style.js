import styled from "styled-components";

const StyledLanding = styled.div`
#left{
position: fixed;
top:0px;
left: 0px;
z-index: -1;
}

#right{
    position: fixed;
    bottom: 0px;
    right: 0px;
    z-index: -1;
}

.landing-content{
    display: flex;
    justify-content:center;
    align-items: center;
    min-height: 100vh;
}

.landing-image{
    margin-right: 80px;
}

.landing-text{
    display: flex;
    flex-direction: column;
    max-width: 493px;
    

    h1{
        color: #3C2CB4;
        font-size:48px;
    }

    p{
        max-width:312px;
        margin: 12px 0 36px 0;
        color: #3C2CB4;
        font-size: 18px;
    }

    button {
        font-size: 24px;
        margin-right: 12px;
        cursor:pointer;
        transition: 150ms ease;
    }

    button:hover{
      transform: scale(1.1);
     };

}



`

export default StyledLanding;
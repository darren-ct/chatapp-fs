import styled from "styled-components";

const StyledRegister = styled.div`
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
    width: 468px;
    height: 230px;
}



button {
    margin-top: 12px
}




`

export default StyledRegister;
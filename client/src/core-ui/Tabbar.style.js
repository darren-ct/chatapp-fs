import styled from "styled-components";

export const StyledTabbar = styled.div`
  
  .tab-bar{
      height: 80px;
      background-color: #E7E5FB;
      transition: 175ms ease;
      display: flex;
      justify-content: flex-start;
      padding: 16px;
      
  };

  .tab-bar.hide{
    height: 0px;
    padding: 0px;
  }
    
`
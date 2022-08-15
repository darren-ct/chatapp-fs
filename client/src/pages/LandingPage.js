import {useNavigate} from "react-router-dom";

import Button from "../components/basic/Button";

import StyledLanding from "../core-ui/pages/LandingPage.style";

import mainImage from "../assets/LandingPage.svg";
import leftCircles from "../assets/left-top.svg";
import rightCircles from "../assets/right-bottom.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <StyledLanding>
            <img id="left" src={leftCircles} alt="top-left" />
            <img id="right" src={rightCircles} alt="right-bottom" />

            <div className="landing-content">
                    <img className="landing-image" src={mainImage} alt="landing-image" />

                    <div className="landing-text">
                        <h1>SELAMAT DATANG DI SAHABATKU...</h1>
                        <p>Tempat berbincang-bincang  online
                           dan berkomunikasi terbaik di seluruh
                           Indonesia .</p>
                        <div className="btn-group">
                             <Button content="LOGIN" styling="primary" onPress={()=>{navigate("/login")}}/>
                             <Button content="DAFTAR" styling="secondary" onPress={()=>{navigate("/signup")}}/>
                        </div>
                    </div>
            </div>
    </StyledLanding>
  )
}

export default LandingPage
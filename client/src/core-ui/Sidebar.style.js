import styled from "styled-components";

export const StyledSidebar = styled.div`

.sidebar{
   
    right: ${(props)=>props.position === "right" ? "0px" : "0px"};
    top: 0px;
    width: ${(props)=>props.position === "right" ? "420px" : "100%"};
    position: absolute;
    z-index: 100;

    min-height: 100vh;
    height: 100%;
    background-color: white;
    transition: 300ms ease;

    padding: 20px 40px;

    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    -ms-overflow-style: none;  
     scrollbar-width: none;  

     border-left: 1px solid rgba(108,92,231,.2);
            
    &::-webkit-scrollbar{
    display: none;
    }
    


    .sidebar-nav{
        display: flex;
        align-items: center;
        margin-bottom: 32px;

        
        img{
            cursor: pointer;
            margin-right: 32px;
        }

        span{
            cursor: pointer;
        }
    }

    .sidebar-content{
        
        position: relative;
        flex:1;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        -ms-overflow-style: none;  
         scrollbar-width: none;  
            
        &::-webkit-scrollbar{
        display: none;
        }

        /* Each component styled by this */
        .search-control{
        width: 100%;
        position: relative;
        margin-bottom: 34px;

        input{
            border-radius:4px;
            width: 100%;
            border: none;
            background-color: #F0EFFD;
            color: #858585 ;
            padding: 16px 64px 16px 16px ;
            outline: none;
            
        }

        img{
            position: absolute;
            right: 20px;
            top: 16px;
        }
        };

        .upload-img{
            cursor: pointer;
            margin: 0 auto;
            position: relative;
            width: 116px;
            display: inline-flex;
            

            flex-direction: column;
            align-items: center;
            justify-content:center;
            margin-bottom: 40px;

            input{
                display: none;
            }

            .profile-image{
                object-fit: cover;
                width:  112px;
                height: 112px;
                border-radius: 100vh;
                border: 1px solid transparent;
                background-color:rgba(108,92,231,.25);
            }

            .edit-icon{
                width: 24px;
                height: 24px;
                position: absolute;
                right: 8px;
                bottom: 30px;
            }

            span{
                margin-top:8px;
                font-size: 18px;
                color: #3C2CB4;
            }
        };

        .fixed-label{
            display: flex;
            align-items: flex-end;

            margin-bottom: 32px;
            color: #3C2CB4;
            font-size: 18px;

            p{   margin-left: 12px;
                font-size: 16px;
            }
        }

        .input-ph{
            display:flex;
            align-items: flex-end;
            color: #3C2CB4;
            font-size: 18px;
            margin-bottom: 4px;

            p{
                font-size: 12px;
                margin-left: 16px;
            }
        };

        .container{
            position: relative;
            flex: 1;
            min-height: 200px;
            overflow-y: scroll;
            -ms-overflow-style: none;  
            scrollbar-width: none;  
            
            &::-webkit-scrollbar{
                display: none;
            }

            .list{
                display: flex;
                flex-direction: column;

                .empty-list{
                    font-weight: bold;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }


        };

        .dynamic{
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);

            img {
                 margin-bottom: 16px;
            };

            .dynamic-message{
                font-size:24px;
                font-weight: bold;
                text-align: center;
                width: 200px;
                margin-bottom: 80px;
            };

            .dynamic-close{
                cursor: pointer;
                color: #3C2CB4;
            }

        }
    }

    


}

.sidebar.hide{
    transform: translate(-100%);
    transform : ${(props)=>props.position === "right" ? "translate(100%)" : "translate(-100%)"};
}


    
`
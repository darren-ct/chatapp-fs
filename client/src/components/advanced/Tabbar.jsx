import { StyledTabbar } from "../../core-ui/Tabbar.style"

const Tabbar = ({list,type,isShown}) => {

  const renderItem = (item) => {
        if(type === "emoticon"){
            return (<img src={item.image}/>)
        } else {
            return (
            <div className="">
                 <img src={item.image} />
                 <span>{item.name}</span>
            </div>)
        }
  };

  return (
    <StyledTabbar>
        <div className={isShown ? "tab-bar" : "tab-bar hide"}>
               {list.map(item => renderItem(item))}
        </div>
    </StyledTabbar>
  )
}

export default Tabbar
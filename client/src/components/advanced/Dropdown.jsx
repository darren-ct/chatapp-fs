import { StyledDropdown } from "../../core-ui/Dropdown.style"

const Dropdown = ({items,toggleSidebar,setSidebarContent}) => {

  const clickHandler = (item) => {
      toggleSidebar();
      setSidebarContent(item)
  };


  return (
    <StyledDropdown>
        {items.map(item => <span onClick={()=>{clickHandler(item)}}>{item}</span>)}
    </StyledDropdown>
  )
}

export default Dropdown
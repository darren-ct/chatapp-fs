import { StyledErrorModal } from "../../core-ui/modals/ErrorModal.style"

import error from "../../assets/error.svg"

const ErrorModal = ({isShown,message}) => {
  return (
    <StyledErrorModal isShown={isShown}>
          <img src={error} />
          <div>{message}</div>
    </StyledErrorModal>
  )
}

export default ErrorModal
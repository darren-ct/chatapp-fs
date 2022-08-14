import { StyledNotificationModal } from "../../core-ui/modals/NotificationModal.style"

import success from "../../assets/success.png"

const NotificationModal = ({isShown,message}) => {
  return (
    <StyledNotificationModal isShown={isShown}>
          
          <img className="success" src={success} />
          <span className="notif">{message}</span>

    </StyledNotificationModal>
  )
}

export default NotificationModal
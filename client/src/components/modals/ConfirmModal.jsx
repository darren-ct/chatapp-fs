import Button from "../basic/Button";

import {StyledConfirmModal} from "../../core-ui/modals/ConfirmModal.style";

const ConfirmModal = ({id,deleteRow,setIsModal}) => {
  return (
    <StyledConfirmModal>
        <div className="modal-body">
            <span>Are you sure you want to delete this?</span>
            <div className="btn-group">
                  <Button styling={"save"} width={"flex-1"} content={"Cancel"} onPress={()=>{setIsModal(false)}}/>
                  <Button styling={"danger"} width={"flex-1"} content={"Yes"} onPress={()=>{deleteRow(id);setIsModal(false)}}/>
            </div>
        </div>
    </StyledConfirmModal>
  )
}

export default ConfirmModal
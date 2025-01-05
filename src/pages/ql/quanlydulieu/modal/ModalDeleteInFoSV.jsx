import { Button, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";

function ModalDeleteInFoSV(props) {
  let { isShowModalDelete, setIsShowModalDelete } = props;
  const handleOk = () => {};
  const handleCancel = () => {
    setIsShowModalDelete(false);
  };
  return (
    <div>
      <div>ModalDeleteInFoSV</div>
      <div>
        <Modal open={isShowModalDelete} onOk={handleOk} onCancel={handleCancel}>
          <b>Bạn có chắc chắn muốn xóa các dòng được chọn ?</b>
        </Modal>
      </div>
    </div>
  );
}

export default ModalDeleteInFoSV;

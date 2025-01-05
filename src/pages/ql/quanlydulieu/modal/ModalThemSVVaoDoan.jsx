import { Button, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";

function ModalThemSVVaoDoan(props) {
  let { isShowModalCreate, setIsShowModalCreate } = props;
  const handleOk = () => {};
  const handleCancel = () => {
    setIsShowModalCreate(false);
  };
  return (
    <div>
      <div>ModalThemSVVaoDoan</div>
      <div>
        <Modal
          title="Basic Modal"
          open={isShowModalCreate}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <table>
            <tr>
              <td className="px-12">Số điện thoại</td>
              <td>
                <Input
                  placeholder="SDT"
                  onChange={(e) => {
                    // setSDTSearch(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="px-12">Cán bộ</td>
              <td>
                <Input
                  placeholder="Trường"
                  onChange={(e) => {
                    // setTruongSearch(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="px-12">Mã đoạn</td>
              <td>
                <Select
                  value={""}
                  placeholder="Chọn trạng thái liên hệ"
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) => {
                    // setMaPQSearch(value);
                  }}
                  //   options={[{ label: "Tất cả", value: "" }, ...phanquyen]}
                />
              </td>
            </tr>
          </table>
        </Modal>
      </div>
    </div>
  );
}

export default ModalThemSVVaoDoan;

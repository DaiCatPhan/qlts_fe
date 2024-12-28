import { Button, Input, Modal, Select } from "antd";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { API_CUSTOMER, API_DATA } from "../../../constants";
import { toast } from "react-toastify";
import CustomerService from "../../../service/CustomerService";
const { TextArea } = Input;

function ModalUpdateLienHeSinhVien(props) {
  const {
    fetchDetailSegment,
    isShowModalUpdate,
    setIsShowModalUpdate,
    dataSV,
    MaPQ,
    lan,
    SDT,
  } = props;
  const [trangThaiLienHe, settrangThaiLienHe] = useState([]);
  const [MATRANGTHAI, setMATRANGTHAI] = useState();
  const [CHITIETTRANGTHAI, setCHITIETTRANGTHAI] = useState();
  const [tab, setTab] = useState(1);

  const { data: dataStatus, mutate: fetchDataStatus } = useSWR(
    `${API_DATA}/status`
  );

  console.log("dataSV", dataSV);
  console.log("MATRANGTHAI", MATRANGTHAI);

  useEffect(() => {
    if (dataSV) {
      setMATRANGTHAI(dataSV?.lienhe[0]?.MATRANGTHAI);
      setCHITIETTRANGTHAI(dataSV?.lienhe[0]?.CHITIETTRANGTHAI);
    }
    if (dataStatus) {
      const dataStatusTemp = dataStatus?.map((item) => {
        return {
          value: item.MATRANGTHAI,
          label: item.TENTRANGTHAI,
        };
      });
      settrangThaiLienHe(dataStatusTemp);
    }
  }, [dataStatus, dataSV]);

  const handleOk = async () => {
    if (!MATRANGTHAI) {
      return toast.warning("Vui lòng chọn trạng thái liên hệ !!!");
    }
    let data = {
      SDT_KH: dataSV.SDT,
      SDT: SDT,
      MATRANGTHAI: MATRANGTHAI,
      LAN: lan,
      MaPQ: MaPQ,
    };

    if (CHITIETTRANGTHAI) {
      data.CHITIETTRANGTHAI = CHITIETTRANGTHAI;
    }

    // call api cap nhật
    try {
      const res = await CustomerService.updateContact(data);
      if (res.statusCode == 200) {
        toast.success(res.message);
        await fetchDetailSegment();
        setIsShowModalUpdate(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleCancel = () => {
    setIsShowModalUpdate(false);
  };
  const onChangeTab = (key) => {
    setTab(key);
  };

  const handleChangeTrangThaiLienHe = (value) => {
    setMATRANGTHAI(value);
  };

  const handleChangeTrangThaiChiTiet = (e) => {
    setCHITIETTRANGTHAI(e.target.value);
  };

  return (
    <div>
      <div>
        <Modal
          title="Cập nhật"
          open={isShowModalUpdate}
          onOk={handleOk}
          onCancel={handleCancel}
          width={600}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Cập nhật liên hệ",
              },
              {
                key: "2",
                label: "Cập nhật thông tin cá nhân",
              },
            ]}
            onChange={onChangeTab}
          />
          {tab == 1 ? (
            <div>
              <table className=" w-full">
                <tr>
                  <td>Họ tên: PHAN ĐÀI CÁT</td>
                </tr>
                <tr>
                  <td>Số điện thoai: 123456789</td>
                </tr>
                <tr>
                  <td>
                    Trạng thái (<span className="text-red-600">*</span>)
                    <div>
                      <Select
                        value={MATRANGTHAI}
                        placeholder="Chọn trạng thái liên hệ"
                        style={{
                          width: "100%",
                        }}
                        onChange={handleChangeTrangThaiLienHe}
                        options={trangThaiLienHe}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Ghi chú chi tiết trạng thái (nếu cần)</span>
                    <TextArea
                      rows={4}
                      onChange={handleChangeTrangThaiChiTiet}
                      value={CHITIETTRANGTHAI}
                    />
                  </td>
                </tr>
              </table>
            </div>
          ) : (
            <div>
              <table className=" w-full">
                <tr>
                  <td>Họ tên</td>
                  <td>PHAN DAI CAT</td>
                  <td>Họ tên</td>
                  <td>PHAN DAI CAT</td>
                </tr>
                <tr>
                  <td>Họ tên</td>
                  <td>PHAN DAI CAT</td>
                  <td>Họ tên</td>
                  <td>PHAN DAI CAT</td>
                </tr>
                <tr>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                </tr>
                <tr>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                </tr>
                <tr>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                </tr>
                <tr>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input placeholder="SDT" />
                  </td>
                </tr>
              </table>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default ModalUpdateLienHeSinhVien;

import { IconEdit } from "@tabler/icons-react";
import { Button, Input, Table } from "antd";
import { Select } from "antd";
import useSWR from "swr";
import { API_DATA } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalUpdateLienHeSinhVien from "./modal/ModalUpdateLienHeSinhVien";

function ManagerDataUsermanager() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.account.user);
  const queryParameters = new URLSearchParams(window.location.search);
  const MaPQ = queryParameters.get("MaPQ");
  const lan = queryParameters.get("lan");
  const [SDT, setSDT] = useState("");
  const [data, setData] = useState([]);
  const [trangthai, setTrangthai] = useState(lan);
  const [DALIENHE, setDALIENHE] = useState(3);
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [dataSV, setdataSV] = useState();
  // bộ search
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");

  // get data list
  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_DATA}/segment?MaPQ=${MaPQ}&TRANGTHAILIENHE=${trangthai}&SDT=${user.SDT}&DALIENHE=${DALIENHE}&HOTENSearch=${HOTENSearch}&SDTSearch=${SDTSearch}&EmailSearch=${EmailSearch}&TruongSearch=${TruongSearch}`
  );
  useEffect(() => {
    if (dataList) {
      setData(dataList[0]);
    }
  }, [dataList, trangthai, DALIENHE]);

  // table
  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "SĐT",
      dataIndex: "",
      key: "SDT",
      render: (data) => {
        return <div>{data?.khachhang.SDT}</div>;
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "",
      key: "HOTEN",
      render: (data) => {
        return <div>{data?.khachhang.HOTEN}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "",
      key: "EMAIL",
      render: (data) => {
        return <div>{data?.khachhang.EMAIL}</div>;
      },
    },

    {
      title: "Trường",
      dataIndex: "",
      key: "TENTRUONG",
      render: (data) => {
        return <div>{data?.khachhang?.truong?.TENTRUONG}</div>;
      },
    },
    {
      title: "Đã liên hệ",
      dataIndex: "",
      key: "dalienhe",
      render: (data) => {
        return (
          <div>{data?.lienhe?.length > 0 ? <div>X</div> : <div></div>}</div>
        );
      },
    },

    {
      title: "trạng thái",
      dataIndex: "",
      key: "matrangthai",
      render: (data) => {
        return (
          <div>
            {data?.lienhe?.length > 0 ? (
              <div>{data?.lienhe[0]?.trangthai?.TENTRANGTHAI}</div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },

    {
      title: "mô tả",
      dataIndex: "",
      key: "motatrangthai",
      render: (data) => {
        return (
          <div>
            {data?.lienhe?.length > 0 ? (
              <div>{data?.lienhe[0]?.CHITIETTRANGTHAI}</div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },

    {
      title: "Hành động",
      dataIndex: "",
      key: "address",
      render: (record) => {
        return (
          <div>
            <div>
              <IconEdit
                onClick={() => {
                  setIsShowModalUpdate(true);
                  setdataSV(record);
                }}
                color="orange"
                width={20}
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      },
    },
  ];

  const handleChangeTRANGTHAILIENHE = (value) => {
    setDALIENHE(value);
  };

  return (
    <div>
      {data ? (
        <div>
          <ModalUpdateLienHeSinhVien
            isShowModalUpdate={isShowModalUpdate}
            setIsShowModalUpdate={setIsShowModalUpdate}
            dataSV={dataSV}
            MaPQ={MaPQ}
            lan={lan}
            SDT={data.SDT}
            fetchDetailSegment={fetchDetailSegment}
          />
        </div>
      ) : (
        <div></div>
      )}

      <div>Mã phân đoạn: {MaPQ}</div>
      <div>Lần liên hệ: {lan}</div>
      <div>Số lượng: {data?.chitietpq?.length || 0}</div>

      <div className="  flex justify-center mb-5">
        <div className="w-2/3 border py-4 rounded-md border-blue-600 ">
          <table className="">
            <tr>
              <td className="px-12">Lần liên hệ</td>
              <td>
                <Input value={`Liên hệ lần ${lan}`} readOnly />
              </td>
              <td className="px-12">Trạng thái liên hệ</td>
              <td>
                <Select
                  defaultValue=""
                  style={{
                    width: 200,
                  }}
                  onChange={handleChangeTRANGTHAILIENHE}
                  options={[
                    {
                      value: "3",
                      label: "Tất cả",
                    },
                    {
                      value: "1",
                      label: "Đã liên hệ",
                    },
                    {
                      value: "0",
                      label: "Chưa liên hệ",
                    },
                  ]}
                />
              </td>
            </tr>

            <tr>
              <td className="px-12">Số điện thoại</td>
              <td>
                <Input
                  placeholder="SDT"
                  onChange={(e) => {
                    setSDTSearch(e.target.value);
                  }}
                />
              </td>
              <td className="px-12">Trường</td>
              <td>
                <Input
                  placeholder="Trường"
                  onChange={(e) => {
                    setTruongSearch(e.target.value);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td className="px-12">Họ và tên</td>
              <td>
                <Input
                  placeholder="Họ và tên"
                  onChange={(e) => {
                    setHOTENSearch(e.target.value);
                  }}
                />
              </td>
              <td className="px-12">Email</td>
              <td>
                <Input
                  placeholder="Email"
                  onChange={(e) => {
                    setEmailSearch(e.target.value);
                  }}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>

      {/* TABLE */}
      <div>
        <Table
          dataSource={data?.chitietpq}
          columns={columns}
          pagination={{
            position: ["topRight", "bottomRight"], // Cả trên và dưới
          }}
        />
      </div>
    </div>
  );
}

export default ManagerDataUsermanager;

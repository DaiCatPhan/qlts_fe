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
import { IconChessFilled } from "@tabler/icons-react";

function ManagerDataUsermanager() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);

  const [data, setData] = useState([]);
  const [MaPQ, setMaPQ] = useState("");
  const [trangthai, setTrangthai] = useState("1");
  const [DALIENHE, setDALIENHE] = useState("3");
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
      let temp = [];
      dataList.forEach((item) => {
        item.chitietpq.forEach((i) => {
          temp.push(i);
        });
      });
      console.log(temp);
      setData(temp);
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
      title: "Mã đoạn",
      dataIndex: "",
      key: "maDoan",
      render: (data) => {
        return <div>{}</div>;
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
      width: 180,
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
      width: 180,
    },

    {
      title: "Hành động",
      dataIndex: "",
      key: "address",
      render: (record) => {
        return (
          <div>
            <div>
              <IconChessFilled color="blue"></IconChessFilled>
            </div>
            {/* <div>
              <IconEdit
                onClick={() => {
                  setIsShowModalUpdate(true);
                  setdataSV(record);
                }}
                color="orange"
                width={20}
                className="cursor-pointer"
              />
            </div> */}
          </div>
        );
      },
    },
  ];

  const handleChangeTRANGTHAILIENHE = (value) => {
    setDALIENHE(value);
  };
  const handleChangeLANLIENHE = (value) => {
    setTrangthai(value);
  };

  return (
    <div>
      <div className="  flex justify-center mb-5">
        <div className="w-2/3 border py-4 rounded-md border-blue-600 ">
          <table className="">
            <tr>
              <td className="px-12">Lần liên hệ</td>
              <td>
                <Select
                  defaultValue={trangthai}
                  style={{
                    width: 200,
                  }}
                  onChange={handleChangeLANLIENHE}
                  options={[
                    {
                      value: "",
                      label: "Tất cả",
                    },
                    {
                      value: "1",
                      label: "Liên hệ lần 1",
                    },
                    {
                      value: "2",
                      label: "Liên hệ lần 2",
                    },
                    {
                      value: "3",
                      label: "Liên hệ lần 3",
                    },
                    {
                      value: "4",
                      label: "Liên hệ lần 4",
                    },
                    {
                      value: "5",
                      label: "Liên hệ lần 5",
                    },
                    {
                      value: "6",
                      label: "Liên hệ lần 6",
                    },
                    {
                      value: "7",
                      label: "Liên hệ lần 7",
                    },
                  ]}
                />
              </td>
              <td className="px-12">Trạng thái liên hệ</td>
              <td>
                <Select
                  defaultValue="3"
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
          bordered
          dataSource={data}
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

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
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";

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
          <div>
            {data?.lienhe?.some((item) => item.LAN === trangthai) ? (
              <div>X</div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },

    {
      title: "trạng thái",
      dataIndex: "",
      key: "matrangthai",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == trangthai || "");
        return <div>{lienhe?.trangthai?.TENTRANGTHAI}</div>;
      },
      width: 180,
    },

    {
      title: "mô tả",
      dataIndex: "",
      key: "motatrangthai",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == trangthai || "");
        return <div>{lienhe?.trangthai?.CHITIETTRANGTHAI}</div>;
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
      <div className="flex w-2/3 m-auto justify-around">
        <div>
          <b>Lần liên hệ: {trangthai}</b>
        </div>
        <div>
          <b>Đã liên hệ: chưa làm</b>
        </div>
        <div>
          <b>Chưa liên hệ: chưa làm</b>
        </div>
      </div>

      <div className="  flex justify-center mb-5">
        <div className="w-2/3 border py-4 rounded-md border-gray-400 ">
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

      <div className="flex justify-end">
        <div className="mt-2">
          <span className="mx-2"></span>
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          >
            <b>In (chưa làm)</b>
          </Button>
          <span className="mx-2"></span>
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          >
            <b>Xuất Excel (chưa làm)</b>
          </Button>
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

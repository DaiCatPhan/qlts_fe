import { Input, Table, Button } from "antd";
import { API_DATA } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";
import { IconChessFilled, IconEdit } from "@tabler/icons-react";
import { Tag } from "antd";

function DanhSachSinhVienUM() {
  const user = useSelector((state) => state.account.user);
  const [data, setData] = useState([]);

  // bộ search
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");

  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_DATA}/segment?SDT=${user.SDT}&HOTENSearch=${HOTENSearch}&SDTSearch=${SDTSearch}&EmailSearch=${EmailSearch}&TruongSearch=${TruongSearch}`
  );

  useEffect(() => {
    if (dataList) {
      let dataTemp = [];
      dataList?.forEach((item) => {
        item?.chitietpq.forEach((i) => {
          dataTemp.push(i);
        });
      });
      setData(dataTemp);
    }
  }, [dataList]);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Số điện thoại",
      dataIndex: "",
      key: "SDT",
      render: (data) => {
        return <div>{data?.khachhang?.SDT}</div>;
      },
    },
    {
      title: "CCCD",
      dataIndex: "",
      key: "CCCD",
      render: (data) => {
        return <div>{data?.khachhang?.CCCD}</div>;
      },
    },
    {
      title: "Họ tên",
      dataIndex: "",
      key: "HOTEN",
      render: (data) => {
        return <div>{data?.khachhang?.HOTEN}</div>;
      },
    },
    {
      title: "Trường",
      dataIndex: "",
      key: "TRUONG",
      render: (data) => {
        return <div>{data?.khachhang?.truong?.TENTRUONG}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "",
      key: "EMAIL",
      render: (data) => {
        return <div>{data?.khachhang?.EMAIL}</div>;
      },
    },
    {
      title: "Đoạn",
      dataIndex: "",
      key: "DOAN",
      render: (data) => {
        return <div>{data?.MaPQ}</div>;
      },
    },
    {
      title: "Chi tiết",
      dataIndex: "",
      key: "detail",
      render: (record) => {
        return (
          <div>
            <IconChessFilled color="blue"></IconChessFilled>
          </div>
        );
      },
      width: 90,
    },

    {
      title: "Cập nhật",
      dataIndex: "",
      key: "edit",
      render: (record) => {
        return (
          <div>
            <div>
              <IconEdit
                onClick={() => {}}
                color="orange"
                width={20}
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      },
      width: 90,
    },
  ];

  return (
    <div>
      {/* KHUNG SEARCH */}
      <div className="  flex justify-center mb-5">
        <div className="w-2/3 border py-4 rounded-md border-gray-400 ">
          <table className="">
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
      <div className="flex justify-end">
        <div className="mt-2">
          <span className="mx-5">
            <b>Tổng số sinh viên: {data?.length || 0}</b>
          </span>
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          >
            <b>In</b>
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
            <b>Xuất Excel</b>
          </Button>
        </div>
      </div>
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

export default DanhSachSinhVienUM;

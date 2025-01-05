import { Table, Select, Input, Button } from "antd";
import moment from "moment";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { API_DATA, API_USER } from "../../../constants";
import { IconEdit } from "@tabler/icons-react";
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";
import ModalThemSVVaoDoan from "./modal/ModalThemSVVaoDoan";
import ModalDeleteSVVaoDoan from "./modal/ModalDeleteSVVaoDoan";

function Danhsachdoandulieu() {
  const user = useSelector((state) => state.account.user);
  const [data, setData] = useState([]);
  const [listUM, setListUM] = useState([]);
  const [phanquyen, setPhanquyen] = useState([]);

  // bộ search
  const [MaPQSearch, setMaPQSearch] = useState("");
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");
  const [UMSearch, setUMSearch] = useState("");

  const [trangthai, setTrangthai] = useState("1");
  const [DALIENHE, setDALIENHE] = useState("3");

  // modal
  const [isShowModalCreate, setIsShowModalCreate] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  // get api data
  const { data: dataUM, mutate: fetchDataUM } = useSWR(
    `${API_USER}/user-manager`
  );

  const { data: dataPhanquyen, mutate: fetchDataPhanquyen } = useSWR(
    `${API_DATA}/phanquyen`
  );

  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_DATA}/segment?MaPQ=${MaPQSearch}&SDT=${UMSearch}&HOTENSearch=${HOTENSearch}&SDTSearch=${SDTSearch}&EmailSearch=${EmailSearch}&TruongSearch=${TruongSearch}`
  );
  console.log(data);

  useEffect(() => {
    if (dataUM) {
      let dataUMTemp = dataUM?.map((item) => {
        return {
          label: item?.usermanager?.HOTEN,
          value: item?.usermanager?.SDT,
        };
      });
      setListUM(dataUMTemp);
    }
    if (dataPhanquyen) {
      let dataPhanquyenTemp = dataPhanquyen?.map((item) => {
        return {
          label: item.MaPQ,
          value: item.MaPQ,
        };
      });
      setPhanquyen(dataPhanquyenTemp);
    }
    if (dataList) {
      let temp = [];
      dataList.forEach((item) => {
        let UM = item.usermanager;
        item.chitietpq.forEach((i) => {
          temp.push({ key: i.SDT, usermanager: UM, ...i });
        });
      });
      setData(temp);
    }
  }, [dataList]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

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
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "",
      key: "EMAIL",
      render: (data) => {
        return <div>{data?.khachhang.EMAIL}</div>;
      },
      width: 150,
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
      key: "DOAN",
      render: (data) => {
        return <div>{data?.MaPQ}</div>;
      },
    },

    {
      title: "Cán bộ phụ trách",
      dataIndex: "",
      key: "UM",
      render: (data) => {
        return <div>{data?.usermanager?.HOTEN}</div>;
      },
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
                onClick={() => {
                  // setIsShowModalUpdate(true);
                  // setdataSV(record);
                }}
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

            <tr>
              <td className="px-12">Mã đoạn</td>
              <td>
                <Select
                  value={MaPQSearch}
                  placeholder="Chọn trạng thái liên hệ"
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) => {
                    setMaPQSearch(value);
                  }}
                  options={[{ label: "Tất cả", value: "" }, ...phanquyen]}
                />
              </td>
              <td className="px-12">UM</td>
              <td>
                <Select
                  value={UMSearch}
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) => {
                    setUMSearch(value);
                  }}
                  options={[{ label: "Tất cả", value: "" }, ...listUM]}
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
            onClick={() => {
              setIsShowModalCreate(true);
            }}
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "blue",
              borderColor: "blue",
            }}
          >
            <b>Thêm mới</b>
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
            <b>In tất cả lần liên hệ </b>
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
            <b>Xuất tất cả lần liên hệ</b>
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
            <b>In DS</b>
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
            <b>Xuất DS Excel</b>
          </Button>
          <span className="mx-2"></span>

          <Button
            onClick={() => {
              setIsShowModalDelete(true);
            }}
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "red",
              borderColor: "red",
            }}
          >
            <b>Xóa</b>
          </Button>
          <span className="mx-2"></span>
        </div>
      </div>
      <div>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          dataSource={data}
          columns={columns}
          pagination={{
            position: ["topRight", "bottomRight"],
          }}
        />
      </div>
      <ModalThemSVVaoDoan
        isShowModalCreate={isShowModalCreate}
        setIsShowModalCreate={setIsShowModalCreate}
      />
      <ModalDeleteSVVaoDoan
        isShowModalDelete={isShowModalDelete}
        setIsShowModalDelete={setIsShowModalDelete}
      />
    </div>
  );
}
export default Danhsachdoandulieu;

import { Input, Table, Button, Select } from "antd";
import { API_DATA, API_CUSTOMER } from "../../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";
import { IconChessFilled, IconEdit } from "@tabler/icons-react";
import { Tag } from "antd";
import excel from "../../../components/ExportFile/ExportFile";
import ModalUpdateSinhVien from "../../um/modalDanhSachSinhVienUM/ModalUpdateSinhVien";
import ModalViewSinhVien from "../../um/modalDanhSachSinhVienUM/ModalViewSinhVien";

import ModalDeleteInFoSV from "./modal/ModalDeleteInFoSV";

function DanhSachSinhVien() {
  const user = useSelector((state) => state.account.user);
  const [data, setData] = useState([]);
  const [countData, setCountData] = useState(0);

  console.log(data);

  // bộ search
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");

  // Modal
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [isShowModalView, setIsShowModalView] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataSV, setdataSV] = useState({});
  const handleShowModalUpdate = (data) => {
    setIsShowModalUpdate(true);
    setdataSV(data);
  };
  const handleShowModalView = (data) => {
    setIsShowModalView(true);
    setdataSV(data);
  };
  const handleShowModalDelete = () => {
    setIsShowModalDelete(true);
  };

  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_CUSTOMER}`
  );

  useEffect(() => {
    if (dataList) {
      let temp = dataList[0]?.map((item) => {
        return {
          key: item.SDT,
          ...item,
        };
      });
      setData(temp);
      setCountData(dataList[1]);
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
        return <div>{data?.SDT}</div>;
      },
    },
    {
      title: "CCCD",
      dataIndex: "",
      key: "CCCD",
      render: (data) => {
        return <div>{data?.CCCD}</div>;
      },
    },
    {
      title: "Họ tên",
      dataIndex: "",
      key: "HOTEN",
      render: (data) => {
        return <div>{data?.HOTEN}</div>;
      },
    },
    {
      title: "Trường",
      dataIndex: "",
      key: "TRUONG",
      render: (data) => {
        return <div>{data?.truong?.TENTRUONG}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "",
      key: "EMAIL",
      render: (data) => {
        return <div>{data?.EMAIL}</div>;
      },
    },

    {
      title: "Chi tiết",
      dataIndex: "",
      key: "detail",
      render: (record) => {
        return (
          <div>
            <IconChessFilled
              onClick={() => handleShowModalView(record)}
              color="blue"
              className="cursor-pointer"
            ></IconChessFilled>
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
                onClick={() => handleShowModalUpdate(record)}
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

  // In/Xuất Excel
  function xuatExcel() {
    let header = [
      {
        header: "STT",
        key: "STT",
      },
      {
        header: "Số điện thoại",
        key: "SDT",
      },
      {
        header: "CCCD",
        key: "CCCD",
      },
      {
        header: "Họ và tên",
        key: "HOTEN",
      },
      {
        header: "Trường",
        key: "TRUONG",
      },
      {
        header: "Email",
        key: "EMAIL",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      return {
        STT: i,
        SDT: item?.SDT,
        CCCD: item?.CCCD,
        HOTEN: item?.HOTEN,
        TRUONG: item?.truong?.TENTRUONG || "",
        EMAIL: item?.EMAIL,
      };
    });

    excel.EX_Excel({
      header: header,
      data: dataEx,
      nameFile: `Danh Sách Khách Hàng`,
    });
  }

  function In() {
    let header = [
      {
        header: "STT",
        key: "STT",
      },
      {
        header: "Số điện thoại",
        key: "SDT",
      },
      {
        header: "CCCD",
        key: "CCCD",
      },
      {
        header: "Họ và tên",
        key: "HOTEN",
      },
      {
        header: "Trường",
        key: "TRUONG",
      },
      {
        header: "Email",
        key: "EMAIL",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      return {
        STT: i,
        SDT: item?.SDT,
        CCCD: item?.CCCD,
        HOTEN: item?.HOTEN,
        TRUONG: item?.truong?.TENTRUONG || "",
        EMAIL: item?.EMAIL,
      };
    });

    excel.PRINT_DATA({
      header: header,
      data: dataEx,
      nameFile: `Danh Sách Khách Hàng`,
    });
  }

  // table
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
      // Column configuration not to be checked
      name: record.name,
    }),
  };

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
            onClick={handleShowModalDelete}
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "red",
              borderColor: "red",
            }}
          >
            <b>Xóa(chưa làm)</b>
          </Button>
          <span className="mx-2"></span>
          <Button
            onClick={In}
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
            onClick={xuatExcel}
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          >
            <b>Xuất DS Excel</b>
          </Button>
        </div>
      </div>
      <div>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            position: ["topRight", "bottomRight"], // Cả trên và dưới
          }}
        />
      </div>
      <ModalUpdateSinhVien
        fetchDetailSegment={fetchDetailSegment}
        isShowModalUpdate={isShowModalUpdate}
        setIsShowModalUpdate={setIsShowModalUpdate}
        SDT={dataSV?.SDT}
        data={data}
      />
      <ModalViewSinhVien
        fetchDetailSegment={fetchDetailSegment}
        isShowModalView={isShowModalView}
        setIsShowModalView={setIsShowModalView}
        SDT={dataSV?.SDT}
        data={data}
      />
      <ModalDeleteInFoSV
        fetchDetailSegment={fetchDetailSegment}
        isShowModalDelete={isShowModalDelete}
        setIsShowModalDelete={setIsShowModalDelete}
        SDT={dataSV?.SDT}
        data={data}
      />
    </div>
  );
}

export default DanhSachSinhVien;

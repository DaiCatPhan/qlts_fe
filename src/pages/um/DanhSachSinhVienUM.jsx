import { Input, Table, Button, Select } from "antd";
import { API_DATA } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";
import { IconChessFilled, IconEdit } from "@tabler/icons-react";
import { Tag } from "antd";
import excel from "../../components/ExportFile/ExportFile";
import ModalUpdateSinhVien from "./modalDanhSachSinhVienUM/ModalUpdateSinhVien";
import ModalViewSinhVien from "./modalDanhSachSinhVienUM/ModalViewSinhVien";

function DanhSachSinhVienUM() {
  const user = useSelector((state) => state.account.user);
  const [data, setData] = useState([]);
  const [phanquyen, setPhanquyen] = useState([]);

  // bộ search 
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");
  const [MaPQSearch, setMaPQSearch] = useState("");

  // Modal
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [isShowModalView, setIsShowModalView] = useState(false);
  const [infoRow, setInfoRow] = useState([]);
  const handleShowModalUpdate = (data) => {
    setIsShowModalUpdate(true);
    setInfoRow(data);
  };
  const handleShowModalView = (data) => {
    setIsShowModalView(true);
    setInfoRow(data);
  };

  const { data: dataPhanquyen, mutate: fetchDataPhanquyen } = useSWR(
    `${API_DATA}/phanquyen?SDT=${user.SDT}`
  );

  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_DATA}/segment?SDT=${user.SDT}&MaPQ=${MaPQSearch}&HOTENSearch=${HOTENSearch}&SDTSearch=${SDTSearch}&EmailSearch=${EmailSearch}&TruongSearch=${TruongSearch}`
  );

  useEffect(() => {
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
      let dataTemp = [];
      dataList?.forEach((item) => {
        item?.chitietpq.forEach((i) => {
          dataTemp.push(i);
        });
      });
      setData(dataTemp);
    }
  }, [dataList, dataPhanquyen]);

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

      {
        header: "Đoạn",
        key: "DOAN",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        CCCD: item?.khachhang?.CCCD,
        HOTEN: item?.khachhang?.HOTEN,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        EMAIL: item?.khachhang?.EMAIL,
        DOAN: item?.MaPQ,
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

      {
        header: "Đoạn",
        key: "DOAN",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        CCCD: item?.khachhang?.CCCD,
        HOTEN: item?.khachhang?.HOTEN,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        EMAIL: item?.khachhang?.EMAIL,
        DOAN: item?.MaPQ,
      };
    });

    excel.PRINT_DATA({
      header: header,
      data: dataEx,
      nameFile: `Danh Sách Khách Hàng`,
    });
  }

  function XuatAllLienHe() {
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

      {
        header: "Đoạn",
        key: "DOAN",
      },
      {
        header: "Liên hệ lần 1",
        key: "LAN1",
      },
      {
        header: "Liên hệ lần 2",
        key: "LAN2",
      },
      {
        header: "Liên hệ lần 3",
        key: "LAN3",
      },
      {
        header: "Liên hệ lần 4",
        key: "LAN4",
      },
      {
        header: "Liên hệ lần 5",
        key: "LAN5",
      },
      {
        header: "Liên hệ lần 6",
        key: "LAN6",
      },
      {
        header: "Liên hệ lần 7",
        key: "LAN7",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item, key) => {
      let lienhe = item.lienhe.reduce((acc, lh) => {
        acc[`LAN${lh.LAN}`] = lh.trangthai?.TENTRANGTHAI || "";
        return acc;
      }, {});

      i++;
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        CCCD: item?.khachhang?.CCCD,
        HOTEN: item?.khachhang?.HOTEN,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        EMAIL: item?.khachhang?.EMAIL,
        DOAN: item?.MaPQ,
        LAN1: lienhe.LAN1 || "",
        LAN2: lienhe.LAN2 || "",
        LAN3: lienhe.LAN3 || "",
        LAN4: lienhe.LAN4 || "",
        LAN5: lienhe.LAN5 || "",
        LAN6: lienhe.LAN6 || "",
        LAN7: lienhe.LAN7 || "",
      };
    });

    excel.EX_Excel({
      header: header,
      data: dataEx,
      nameFile: `Danh Sách Khách Hàng`,
    });
  }

  function InAllLienHe() {
    console.log(data);

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
      // {
      //   header: "Email",
      //   key: "EMAIL",
      // },

      {
        header: "Đoạn",
        key: "DOAN",
      },
      {
        header: "Liên hệ lần 1",
        key: "LAN1",
      },
      {
        header: "Liên hệ lần 2",
        key: "LAN2",
      },
      {
        header: "Liên hệ lần 3",
        key: "LAN3",
      },
      {
        header: "Liên hệ lần 4",
        key: "LAN4",
      },
      {
        header: "Liên hệ lần 5",
        key: "LAN5",
      },
      {
        header: "Liên hệ lần 6",
        key: "LAN6",
      },
      {
        header: "Liên hệ lần 7",
        key: "LAN7",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item, key) => {
      let lienhe = item.lienhe.reduce((acc, lh) => {
        acc[`LAN${lh.LAN}`] = lh.trangthai?.TENTRANGTHAI || "";
        return acc;
      }, {});

      i++;
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        CCCD: item?.khachhang?.CCCD,
        HOTEN: item?.khachhang?.HOTEN,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        // EMAIL: item?.khachhang?.EMAIL,
        DOAN: item?.MaPQ,
        LAN1: lienhe.LAN1 || "",
        LAN2: lienhe.LAN2 || "",
        LAN3: lienhe.LAN3 || "",
        LAN4: lienhe.LAN4 || "",
        LAN5: lienhe.LAN5 || "",
        LAN6: lienhe.LAN6 || "",
        LAN7: lienhe.LAN7 || "",
      };
    });

    excel.PRINT_DATA({
      header: header,
      data: dataEx,
      nameFile: `Danh Sách Khách Hàng`,
      font: "8px",
    });
  }

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
            onClick={InAllLienHe}
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
            onClick={XuatAllLienHe}
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
        SDT={infoRow?.khachhang?.SDT}
        data={data}
      />
      <ModalViewSinhVien
        fetchDetailSegment={fetchDetailSegment}
        isShowModalView={isShowModalView}
        setIsShowModalView={setIsShowModalView}
        SDT={infoRow?.khachhang?.SDT}
        data={data}
      />
    </div>
  );
}

export default DanhSachSinhVienUM;

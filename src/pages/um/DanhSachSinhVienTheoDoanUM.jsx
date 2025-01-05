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
import moment from "moment";
import excel from "../../components/ExportFile/ExportFile";

function ManagerDataUsermanager() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);

  const [data, setData] = useState([]);
  const [phanquyen, setPhanquyen] = useState([]);

  const [trangthai, setTrangthai] = useState("1");
  const [DALIENHE, setDALIENHE] = useState("3");

  // bộ search
  const [MaPQSearch, setMaPQSearch] = useState("");
  const [HOTENSearch, setHOTENSearch] = useState("");
  const [SDTSearch, setSDTSearch] = useState("");
  const [EmailSearch, setEmailSearch] = useState("");
  const [TruongSearch, setTruongSearch] = useState("");

  // modal
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [dataSV, setdataSV] = useState();

  // get data
  const { data: dataPhanquyen, mutate: fetchDataPhanquyen } = useSWR(
    `${API_DATA}/phanquyen?SDT=${user?.SDT}`
  );
  const { data: dataList, mutate: fetchDetailSegment } = useSWR(
    `${API_DATA}/segment?MaPQ=${MaPQSearch}&TRANGTHAILIENHE=${trangthai}&SDT=${user.SDT}&DALIENHE=${DALIENHE}&HOTENSearch=${HOTENSearch}&SDTSearch=${SDTSearch}&EmailSearch=${EmailSearch}&TruongSearch=${TruongSearch}`
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
      let temp = [];
      dataList.forEach((item) => {
        item.chitietpq.forEach((i) => {
          temp.push(i);
        });
      });
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
      title: "Ngày liên hệ",
      dataIndex: "",
      key: "NGAYLIENHE",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == trangthai || "");
        return (
          <div>{lienhe && moment(lienhe?.THOIGIAN).format("DD-MM-YYYY")}</div>
        );
      },
    },

    {
      title: "Đã liên hệ",
      dataIndex: "",
      key: "DALIENHE",
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
      key: "TRANGTHAI",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == trangthai || "");
        return <div>{lienhe?.trangthai?.TENTRANGTHAI}</div>;
      },
      width: 180,
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
      width: 90,
    },
  ];

  const handleChangeTRANGTHAILIENHE = (value) => {
    setDALIENHE(value);
  };
  const handleChangeLANLIENHE = (value) => {
    setTrangthai(value);
  };

  // In/Xuất dữ liệu excel
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
        header: "Họ và tên",
        key: "HOTEN",
      },
      {
        header: "Email",
        key: "EMAIL",
      },
      {
        header: "Trường",
        key: "TRUONG",
      },
      {
        header: "Đoạn",
        key: "DOAN",
      },
      {
        header: "Ngày liên hệ",
        key: "NGAYLIENHE",
      },
      {
        header: "Đã liên hệ",
        key: "DALIENHE",
      },
      {
        header: "Trạng thái",
        key: "TRANGTHAI",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      let lienhe = item?.lienhe?.find((i) => i.LAN == trangthai) || {};
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        HOTEN: item?.khachhang?.HOTEN,
        EMAIL: item?.khachhang?.EMAIL,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        DOAN: item?.MaPQ,
        NGAYLIENHE: lienhe?.THOIGIAN
          ? moment(lienhe?.THOIGIAN).format("DD-MM-YYYY")
          : "",
        DALIENHE: lienhe?.MALIENHE ? "X" : "",
        TRANGTHAI: lienhe?.trangthai ? lienhe?.trangthai?.TENTRANGTHAI : "",
      };
    });

    excel.EX_Excel({
      header: header,
      data: dataEx,
      nameFile: `DANH SÁCH KHÁCH HÀNG LIÊN HỆ LẦN ${trangthai}`,
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
        header: "Họ và tên",
        key: "HOTEN",
      },
      {
        header: "Email",
        key: "EMAIL",
      },
      {
        header: "Trường",
        key: "TRUONG",
      },
      {
        header: "Đoạn",
        key: "DOAN",
      },
      {
        header: "Ngày liên hệ",
        key: "NGAYLIENHE",
      },
      {
        header: "Đã liên hệ",
        key: "DALIENHE",
      },
      {
        header: "Trạng thái",
        key: "TRANGTHAI",
      },
    ];

    let i = 0;
    let dataEx = data?.map((item) => {
      i++;
      let lienhe = item?.lienhe?.find((i) => i.LAN == trangthai) || {};
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        HOTEN: item?.khachhang?.HOTEN,
        EMAIL: item?.khachhang?.EMAIL,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        DOAN: item?.MaPQ,
        NGAYLIENHE: lienhe?.THOIGIAN
          ? moment(lienhe?.THOIGIAN).format("DD-MM-YYYY")
          : "",
        DALIENHE: lienhe?.MALIENHE ? "X" : "",
        TRANGTHAI: lienhe?.trangthai ? lienhe?.trangthai?.TENTRANGTHAI : "",
      };
    });

    excel.PRINT_DATA({
      header: header,
      data: dataEx,
      nameFile: `DANH SÁCH KHÁCH HÀNG LIÊN HỆ LẦN ${trangthai}`,
    });
  }

  // count Liên Hệ
  const countLienHe = (data, lan) => {
    let daLienHe = 0;
    let chuaLienHe = 0;

    data?.forEach((item) => {
      let lienhe = item?.lienhe?.find((i) => i.LAN == lan) || {};
      if (lienhe?.MALIENHE) {
        daLienHe++;
      } else {
        chuaLienHe++;
      }
    });
    return { daLienHe, chuaLienHe };
  };

  let lienhe = countLienHe(data, trangthai);

  return (
    <div>
      <div className="flex w-2/3 m-auto justify-around">
        <div>
          <b>Lần liên hệ: {trangthai}</b>
        </div>
        <div>
          <b>Tổng liên hệ: {data?.length}</b>
        </div>
        <div>
          <b>Đã liên hệ: {lienhe?.daLienHe}</b>
        </div>
        <div>
          <b>Chưa liên hệ: {lienhe?.chuaLienHe}</b>
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

      <div className="flex justify-end">
        <div className="mt-2">
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
            <b>In</b>
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
            <b>Xuất Excel</b>
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

      <ModalUpdateLienHeSinhVien
        isShowModalUpdate={isShowModalUpdate}
        setIsShowModalUpdate={setIsShowModalUpdate}
        SDT_KH={dataSV?.SDT}
        MaPQ={dataSV?.MaPQ}
        lan={trangthai}
        SDT={user?.SDT}
        fetchDetailSegment={fetchDetailSegment}
      />
    </div>
  );
}

export default ManagerDataUsermanager;

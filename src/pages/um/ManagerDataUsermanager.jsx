import { IconChessFilled, IconEdit } from "@tabler/icons-react";
import { Button, Input, Table } from "antd";
import { Select } from "antd";
import useSWR from "swr";
import { API_DATA } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BackwardOutlined, FileExcelOutlined } from "@ant-design/icons";
import ModalUpdateLienHeSinhVien from "./modal/ModalUpdateLienHeSinhVien";
import excel from "../../components/ExportFile/ExportFile";
import moment from "moment";

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
        return <div>{data?.khachhang?.SDT}</div>;
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "",
      key: "HOTEN",
      render: (data) => {
        return <div>{data?.khachhang?.HOTEN}</div>;
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
      title: "Trường",
      dataIndex: "",
      key: "TENTRUONG",
      render: (data) => {
        return <div>{data?.khachhang?.truong?.TENTRUONG}</div>;
      },
    },
    {
      title: "Ngày liên hệ",
      dataIndex: "",
      key: "ngayLienHe",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == lan) || "";
        return (
          <div>
            {lienhe && moment(data?.lienhe?.THOIGIAN).format("DD-MM-YYYY")}
          </div>
        );
      },
    },

    {
      title: "Đã liên hệ",
      dataIndex: "",
      key: "dalienhe",
      render: (data) => {
        return (
          <div>
            {data?.lienhe?.some((item) => item?.LAN === lan) ? (
              <div>X</div>
            ) : (
              <div></div>
            )}
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "",
      key: "trangthai",
      render: (data) => {
        let lienhe = data?.lienhe?.find((i) => i.LAN == lan) || "";
        return <div>{lienhe?.trangthai?.TENTRANGTHAI}</div>;
      },
      width: 180,
    },

    // {
    //   title: "Chi tiết",
    //   dataIndex: "",
    //   key: "detail",
    //   render: (record) => {
    //     return (
    //       <div>
    //         <IconChessFilled color="blue"></IconChessFilled>
    //       </div>
    //     );
    //   },
    //   width: 90,
    // },

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
    let dataEx = data?.chitietpq?.map((item) => {
      i++;
      let lienhe = item?.lienhe?.find((i) => i.LAN == lan) || {};
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        HOTEN: item?.khachhang?.HOTEN,
        EMAIL: item?.khachhang?.EMAIL,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
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
      nameFile: `danhSachKhachHang_${MaPQ}_LAN${lan}`,
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
    let dataEx = data?.chitietpq?.map((item) => {
      i++;
      let lienhe = item?.lienhe?.find((i) => i.LAN == lan) || "";
      return {
        STT: i,
        SDT: item?.khachhang?.SDT,
        HOTEN: item?.khachhang?.HOTEN,
        EMAIL: item?.khachhang?.EMAIL,
        TRUONG: item?.khachhang?.truong?.TENTRUONG || "",
        NGAYLIENHE: lienhe && moment(lienhe?.THOIGIAN).format("DD-MM-YYYY"),
        DALIENHE: lienhe?.MALIENHE ? "X" : "",
        TRANGTHAI: lienhe?.trangthai ? lienhe?.trangthai?.TENTRANGTHAI : "",
      };
    });

    excel.PRINT_DATA({
      header: header,
      data: dataEx,
      nameFile: `DANH SÁCH KHÁCH HÀNG ${MaPQ} LẦN ${lan}`,
    });
  }

  return (
    <div>
      {data ? (
        <div>
          <ModalUpdateLienHeSinhVien
            isShowModalUpdate={isShowModalUpdate}
            setIsShowModalUpdate={setIsShowModalUpdate}
            SDT_KH={dataSV?.SDT}
            MaPQ={MaPQ}
            lan={lan}
            SDT={data.SDT}
            fetchDetailSegment={fetchDetailSegment}
          />
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex w-2/3 m-auto justify-around">
        <div>
          <b>Mã phân đoạn: {MaPQ}</b>
        </div>
        <div>
          <b>Lần liên hệ: {lan}</b>
        </div>
        <div>
          <b>
            Số lượng:
            {data?.chitietpq?.lienhe
              ? data?.chitietpq?.filter((item) =>
                  item?.lienhe?.some((i) => i.LAN == lan)
                ).length
              : data?.chitietpq?.length}
          </b>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-2/3 border py-4 rounded-md border-gray-400 ">
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

      <div className="flex justify-end">
        <div className="mt-2">
          <Button
            onClick={() => {
              navigate("/usermanager/doandulieu");
            }}
            icon={<BackwardOutlined />}
            style={{
              backgroundColor: "white",
              color: "grey",
              borderColor: "grey",
            }}
          >
            <b>Trở về</b>
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

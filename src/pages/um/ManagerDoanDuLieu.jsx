import { IconEdit } from "@tabler/icons-react";
import { IconListDetails } from "@tabler/icons-react";
import { Table } from "antd";
import { Select } from "antd";
import useSWR from "swr";
import { API_DATA } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Input } from "antd";
import { toast } from "react-toastify";
import moment from "moment";

function ManagerDataUsermanager() {
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [MaPQ, setMaPQ] = useState("");

  const { data: dataList, mutate: fetchDataSegmentUsermanager } = useSWR(
    `${API_DATA}/segment?SDT=${user?.SDT}&MaPQ=${MaPQ}`
  );

  useEffect(() => {
    if (dataList) {
      setData(dataList);
    }
  }, [dataList, MaPQ]);

  const handleDetailDoan = (record) => {
    if (record.TRANGTHAILIENHE == 0) {
      return toast.warning("ADMIN chưa mở lần liên hệ !!!");
    }
    navigate(
      `/usermanager/data?MaPQ=${record.MaPQ}&lan=${record.TRANGTHAILIENHE}`
    );
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã đoạn",
      dataIndex: "MaPQ",
      key: "MaPQ",
    },

    {
      title: "Lần liên hệ",
      dataIndex: "TRANGTHAILIENHE",
      key: "TRANGTHAILIENHE",
    },

    {
      title: "Thời gian bắt đầu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        return <div>{moment(createdAt).format("DD-MM-YYYY")}</div>;
      },
    },

    {
      title: "Tổng số sinh viên",
      dataIndex: "",
      key: "dalienhe",
      render: (data) => {
        return <div>{data.chitietpq.length}</div>;
      },
    },

    {
      title: "Đã liên hệ",
      dataIndex: "",
      key: "dalienhe",
      render: (data) => {
        let daLienHe = data?.chitietpq.filter((item) => {
          return item?.lienhe.some((i) => i.LAN == data.TRANGTHAILIENHE);
        });
        return <div>{daLienHe?.length}</div>;
      },
    },

    {
      title: "Chưa liên hệ",
      dataIndex: "",
      key: "chualienhe",
      render: (data) => {
        let chuaLienHe = data?.chitietpq.filter((item) => {
          return !item?.lienhe.some((i) => i.LAN == data.TRANGTHAILIENHE);
        });
        return <div>{chuaLienHe?.length}</div>;
      },
    },

    {
      title: "Chi tiết",
      dataIndex: "",
      key: "detail",
      render: (record) => {
        return (
          <div>
            <div>
              <IconListDetails
                onClick={() => handleDetailDoan(record)}
                color="blue"
                width={20}
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      },
    },
  ];

  const handleChangeTrangThai = (value) => {
    setTRANGTHAILIENHE(value);
    fetchDataSegmentUsermanager();
  };

  const handleChangeMaPQ = (e) => {
    setMaPQ(e.target.value);
  };

  return (
    <div>
      <div className="  flex justify-center mb-5">
        <div className="w-1/3 border py-4 rounded-md border-gray-400 ">
          <table className="">
            <tr>
              <td className="px-12">Đoạn dữ liệu</td>
              <td>
                <Input
                  placeholder="Nhập đoạn dữ liệu"
                  onChange={handleChangeMaPQ}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
      {/* TABLE */}
      <div>
        <Table dataSource={data} columns={columns} bordered />
      </div>
    </div>
  );
}

export default ManagerDataUsermanager;

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

function ManagerDataUsermanager() {
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [TRANGTHAILIENHE, setTRANGTHAILIENHE] = useState("");
  const [MaPQ, setMaPQ] = useState("");

  const { data: dataList, mutate: fetchDataSegmentUsermanager } = useSWR(
    `${API_DATA}/segment?SDT=${user?.SDT}&TRANGTHAILIENHE=${TRANGTHAILIENHE}&MaPQ=${MaPQ}`
  );

  useEffect(() => {
    if (dataList) {
      setData(dataList);
    }
  }, [dataList, TRANGTHAILIENHE, MaPQ]);

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
      title: "Mở liên hệ lần",
      dataIndex: "TRANGTHAILIENHE",
      key: "TRANGTHAILIENHE",
    },

    {
      title: "Thời gian tạo đoạn",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    {
      title: "Đã liên hệ",
      dataIndex: "",
      key: "dalienhe",
    },

    {
      title: "Chưa liên hệ",
      dataIndex: "",
      key: "chualienhe",
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
        <div className="w-1/3 border py-4 rounded-md border-blue-600 ">
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

            <tr>
              <td className="px-12">Lần liên hệ</td>
              <td>
                <Select
                  defaultValue=""
                  style={{
                    width: 200,
                  }}
                  onChange={handleChangeTrangThai}
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
            </tr>
          </table>
        </div>
      </div>
      {/* TABLE */}
      <div>
        <Table dataSource={data} columns={columns} />
      </div>
    </div>
  );
}

export default ManagerDataUsermanager;

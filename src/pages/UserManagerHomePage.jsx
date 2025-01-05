import {
  faEllipsisVertical,
  faPencil,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Modal, Space } from "antd";
import useSWR from "swr";
import { API_NOTE, API_THEMATIC, API_DATA } from "../constants";
import { User } from "@nextui-org/react";
import { IconEdit } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import NoteService from "../service/NoteService";
import MisscallService from "../service/MisscallService";
import moment from "moment";
import { Table } from "antd";
import ModalUpdateLienHeSinhVien from "./um/modal/ModalUpdateLienHeSinhVien";

function UserManagerHomePage() {
  const user = useSelector((state) => state.account.user);
  const [MATRANGTHAI, setMATRANGTHAI] = useState("tt06");
  const [dataMisscall, setdataMisscall] = useState([]);
  const [note, setNote] = useState("");

  // modal
  const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
  const [dataSV, setdataSV] = useState();

  const { data: dataMisscallRaw, mutate: fetchDataMisscallRaw } = useSWR(
    `${API_DATA}/getLienHeMissCall?SDT=${user.SDT}&MATRANGTHAI=${MATRANGTHAI}`
  );

  const { data: dataNote, mutate: fetchDataNote } = useSWR(
    `${API_NOTE}/readAll?SDT=${user.SDT}`
  );

  useEffect(() => {
    if (dataMisscallRaw) {
      setdataMisscall(dataMisscallRaw);
    }
  }, [dataMisscallRaw]);

  const handleCreateNote = async () => {
    try {
      const currentDay = new Date();
      const data = {
        SDT: user.SDT,
        NOIDUNG: note,
        THOIGIAN: currentDay,
        TRANGTHAI: 0,
      };
      const res = await NoteService.createNote(data);
      fetchDataNote();
      toast.success(res.message);
      setNote("");
    } catch (e) {
      console.log(e);
      toast.error(e.message[0]);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleCreateNote();
    }
  };

  const handleDeleteNote = async (e) => {
    try {
      const STT = e.STT;
      const res = await NoteService.deleteUser(STT);
      toast.success(res.message);
      fetchDataNote();
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const columnsMisscall = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => index + 1,
    },

    {
      title: "SDT",
      dataIndex: "",
      key: "",
      render: (data) => {
        return <div>{data?.SDT_KH}</div>;
      },
    },
    {
      title: "Họ tên",
      dataIndex: "HOTEN",
      key: "HOTEN",
      render: (data) => {
        return <div>{data}</div>;
      },
    },
    {
      title: "Đoạn",
      dataIndex: "MaPQ",
      key: "MaPQ",
    },
    {
      title: "Lần",
      dataIndex: "LAN",
      key: "LAN",
    },
    {
      title: "Ngày liên hệ",
      dataIndex: "THOIGIAN",
      key: "THOIGIAN",
      render: (THOIGIAN) => {
        return moment(THOIGIAN).format("DD-MM-YYYY");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "TENTRANGTHAI",
      key: "TENTRANGTHAI",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "action",
      render: (record) => {
        return (
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
        );
      },
      width: 40,
    },
  ];

  return (
    <>
      <div>
        <div
          style={{
            padding: 24,
            minHeight: 450,
            background: "#fff",
            borderRadius: "10px",
          }}
        >
          <h1 className="mb-2 text-lg font-medium">Tất cả các cuộc gọi nhỡ</h1>
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 px-0 md:px-5">
              <Table
                dataSource={dataMisscall}
                columns={columnsMisscall}
                bordered
              />
            </div>
            <div className="col-span-3 md:col-span-1 px-0 md:px-6 mt-5 md:mt-0">
              <div className="border-double border-5 border-gray-100 rounded-xl shadow-lg">
                <div className="title w-full bg-yellow-400 rounded-t-lg text-white">
                  <h2 className="mb-2 text-medium font-medium text-center py-2">
                    Ghi chú
                  </h2>
                </div>
                <div className="content min-h-64 max-h-64 overflow-y-auto">
                  {dataNote && dataNote.length > 0 ? (
                    dataNote.map((note, index) => (
                      <div key={index} className="note my-2">
                        <div className="grid grid-cols-12">
                          <User
                            className="col-span-2"
                            avatarProps={{
                              src: "https://i.pinimg.com/564x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg",
                            }}
                          />
                          <div className="bg-gray-100 col-span-9 rounded-t-xl rounded-ee-xl px-2 h-auto break-words">
                            <p className="font-medium">{user.HOTEN}</p>
                            <p>{note.NOIDUNG}</p>
                          </div>
                          <Dropdown
                            className="col-span-1 m-auto"
                            menu={{
                              items: [
                                {
                                  label: (
                                    <p
                                      className="font-medium text-red-500"
                                      onClick={() => handleDeleteNote(note)}
                                    >
                                      Xóa
                                    </p>
                                  ),
                                  key: "0",
                                },
                              ],
                            }}
                            trigger={["click"]}
                          >
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Space>
                            </a>
                          </Dropdown>
                        </div>
                        <div className="timeCreateNote text-end text-xs text-gray-400">
                          {moment(note.THOIGIAN).format("DD-MM-YYYY HH:mm")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      Không có ghi chú nào.
                    </div>
                  )}
                </div>
                <div className="createNote">
                  <div className="groupInput mt-5 grid grid-cols-[1fr_auto] gap-0 border-t-1 px-5">
                    <input
                      type="text"
                      className="outline-none  h-10 px-2"
                      placeholder="Viết ghi chú"
                      value={note}
                      onChange={(value) => setNote(value.target.value)}
                      onKeyDown={handleEnter}
                    />
                    <div className="flex">
                      <FontAwesomeIcon
                        fontSize={16}
                        className="bg-yellow-400 m-auto p-2 rounded-full text-white"
                        icon={faPencil}
                        onClick={handleCreateNote}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalUpdateLienHeSinhVien
          isShowModalUpdate={isShowModalUpdate}
          setIsShowModalUpdate={setIsShowModalUpdate}
          SDT_KH={dataSV?.SDT_KH}
          MaPQ={dataSV?.MaPQ}
          lan={dataSV?.LAN}
          SDT={user?.SDT}
          fetchDetailSegment={fetchDataMisscallRaw}
        />
      </div>
    </>
  );
}

export default UserManagerHomePage;

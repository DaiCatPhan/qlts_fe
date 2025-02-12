// import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  faAddressCard,
  faClipboard,
  faUser,
  faPenToSquare,
  faFloppyDisk,
} from "@fortawesome/free-regular-svg-icons";
import { faBullseye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tooltip,
  Input,
} from "@nextui-org/react";
import { Result, Tag } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import { API_CUSTOMER } from "../constants";
import { useAuth } from "../hooks";

import SegmentService from "../service/SegmentService";
import CustomerService from "../service/CustomerService";
import { IconFile } from "@tabler/icons-react";

function DetailCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { id } = useParams();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const { logout } = useAuth();
  const { data, mutate } = useSWR(`${API_CUSTOMER}/${user.SDT_KH}`);

  if (!isAuthenticated) {
    return (
      <div>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Link to={"/"} type="primary">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // handleFile
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    let file = event.target.files;
    setSelectedFile(file);
  };

  const handleUploadFile = async (onClose) => {
    if (!selectedFile) {
      return toast.warning("Vui lòng chọn file update nhé ");
    }
    const formData = new FormData();
    Array.from(selectedFile).forEach((file) => {
      formData.append("file", file);
    });
    formData.append("MAPHIEUDK", data?.phieudkxettuyen?.MAPHIEUDK);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          folder_type: `hosoPhieudkxettuyen/${user.SDT_KH}`,
        },
      };
      setLoading(true);
      const res = await SegmentService.dataFileCustomer(formData, config);
      if (res && res.statusCode === 200) {
        toast.success("Upload file thành công");
        onOpenChange(false);
        mutate();
        setSelectedFile(null);
      }
    } catch (error) {
      if (error.statusCode == 500 || error.statusCode == 422) {
        toast.error("Có lỗi trong quá trình upload");
      }
    } finally {
      setLoading(false);
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [fullName, setFullName] = useState("");
  const [province, setProvince] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneFather, setPhoneFather] = useState("");
  const [phoneMother, setPhoneMother] = useState("");
  const [zalo, setZalo] = useState("");
  const [faceBook, setFaceBook] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setFullName(data?.HOTEN);
    setProvince(data?.tinh.TENTINH);
    setSchool(data?.truong.TENTRUONG);
    setPhone(data?.SDT);
    setPhoneFather(data?.dulieukhachhang.SDTBA || "");
    setPhoneMother(data?.dulieukhachhang.SDTME || "");
    setZalo(data?.dulieukhachhang.SDTZALO || "");
    setFaceBook(data?.dulieukhachhang.FACEBOOK || "");
    setEmail(data?.EMAIL || "");
  }, [data]);

  const handleEditToggle = () => {
    setIsEdit(!isEdit);
  };

  const handleUpdateInfo = async () => {
    try {
      const dataInfo = {
        customer: {
          SDT: phone,
          HOTEN: fullName,
          EMAIL: email,
        },
        data: {
          SDTBA: phoneFather,
          SDTME: phoneMother,
          SDTZALO: zalo,
          FACEBOOK: faceBook,
        },
      };
      const res = await CustomerService.updateCustomer(dataInfo);
      mutate();
      toast.success(res.message);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div>
        <div className="headerPage bg-white flex ">
          <img className="w-10/12 m-auto" src="/image/logoHeader2.png" alt="" />
        </div>
        <div className="container mx-auto">
          {data === undefined ? (
            <div
              className="flex-col justify-center items-center"
              style={{ height: 500 }}
            >
              <img
                className="m-auto mt-16 w-80"
                src="/image/userNotFound.png"
                alt=""
              />
              <h1 className="text-center text-xl mt-4 font-bold">
                Không tìm thấy khách hàng
              </h1>
              <Button
                className="m-auto flex mt-4"
                color="primary"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-center mt-5 mb-5">
                THÔNG TIN HỌC SINH
              </h1>
              <div className="grid grid-cols-2 mt-4">
                <div className="col-span-2 md:col-span-1">
                  <Card className="max-w-[500px] m-auto h-full">
                    <CardHeader className="flex gap-3 px-6 justify-center">
                      <FontAwesomeIcon icon={faUser} />
                      <div className="flex">
                        <h1 className="font-bold">Thông tin cá nhân</h1>
                        <div
                          onClick={handleEditToggle}
                          className="absolute right-5 cursor-pointer"
                        >
                          {isEdit ? (
                            <Tooltip content="Lưu" color="primary">
                              <FontAwesomeIcon
                                onClick={handleUpdateInfo}
                                className="text-blue-600"
                                size="lg"
                                icon={faFloppyDisk}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip content="Chỉnh sửa" color="primary">
                              <FontAwesomeIcon
                                size="lg"
                                className="text-blue-600"
                                icon={faPenToSquare}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 gap-4">
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Họ và tên</p>
                        <p>{data?.HOTEN}</p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Tỉnh/Thành phố</p>
                        <p>{data?.tinh?.TENTINH}</p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Trường</p>
                        <p>{data?.truong?.TENTRUONG}</p>
                      </div>
                    </CardBody>
                    <Divider />
                    <CardHeader className="flex gap-3 px-6 justify-center">
                      <FontAwesomeIcon icon={faAddressCard} />
                      <div className="">
                        <h1 className="font-bold">Thông tin liên hệ</h1>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 gap-4">
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Điện thoại</p>
                        <p>{data?.dulieukhachhang?.SDT}</p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">
                          Điện thoại ba
                        </p>
                        {isEdit ? (
                          <Input
                            type="text"
                            style={{ textAlign: "right", fontSize: "16px" }}
                            aria-placeholder="fullName"
                            size="sm"
                            className="w-32"
                            variant="underlined"
                            value={phoneFather}
                            onValueChange={setPhoneFather}
                          />
                        ) : (
                          <p>{data?.dulieukhachhang?.SDTBA || ""}</p>
                        )}
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">
                          Điện thoại mẹ
                        </p>
                        {isEdit ? (
                          <Input
                            type="text"
                            style={{ textAlign: "right", fontSize: "16px" }}
                            aria-placeholder="fullName"
                            className="w-32"
                            variant="underlined"
                            value={phoneMother}
                            onValueChange={setPhoneMother}
                          />
                        ) : (
                          <p>{data?.dulieukhachhang?.SDTME || ""}</p>
                        )}
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">Zalo</p>
                        {isEdit ? (
                          <Input
                            type="text"
                            style={{ textAlign: "right", fontSize: "16px" }}
                            aria-placeholder="fullName"
                            className="w-32"
                            variant="underlined"
                            value={zalo}
                            onValueChange={setZalo}
                          />
                        ) : (
                          <p>{data?.dulieukhachhang?.SDTZALO || ""}</p>
                        )}
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">FaceBook</p>
                        {isEdit ? (
                          <Input
                            type="text"
                            style={{ textAlign: "right", fontSize: "16px" }}
                            aria-placeholder="fullName"
                            className="w-32"
                            variant="underlined"
                            value={faceBook}
                            onValueChange={setFaceBook}
                          />
                        ) : (
                          <p>{data?.dulieukhachhang?.FACEBOOK || ""}</p>
                        )}
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">Email</p>
                        {isEdit ? (
                          <Input
                            type="text"
                            style={{ textAlign: "right", fontSize: "16px" }}
                            aria-placeholder="fullName"
                            className="w-40"
                            variant="underlined"
                            value={email}
                            onValueChange={setEmail}
                          />
                        ) : (
                          <p>{data?.EMAIL || ""}</p>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Card className="max-w-[500px] m-auto h-full">
                    <CardHeader className="flex gap-3 px-6 justify-center">
                      <FontAwesomeIcon icon={faBullseye} />
                      <div className="">
                        <h1 className="font-bold">Đối tượng</h1>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 gap-4">
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Nghề nghiệp</p>
                        <p>{data?.nghenghiep?.TENNGHENGHIEP || ""}</p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Hình thức thu thập</p>
                        <p>{data?.hinhthucthuthap?.TENHINHTHUC || ""}</p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold flex items-center">
                          Ngành yêu thích
                        </p>
                        <div className="text-right w-72">
                          {data?.nganhyeuthich?.length != 0
                            ? data?.nganhyeuthich.map((job, index) => (
                                <Tag
                                  key={index}
                                  bordered={false}
                                  color="processing"
                                >
                                  {job?.nganh?.TENNGANH}
                                </Tag>
                              ))
                            : ""}
                        </div>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Ngành đăng ký</p>
                        <p>{data?.phieudkxettuyen?.nganh?.TENNGANH || ""}</p>
                      </div>
                    </CardBody>
                    <Divider />
                    <CardHeader className="flex gap-3 px-6 justify-center">
                      <FontAwesomeIcon icon={faClipboard} />
                      <div className="">
                        <h1 className="font-bold">Phiếu đăng ký</h1>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-6 gap-4">
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Kênh nhận thông báo</p>
                        <p>
                          {data?.phieudkxettuyen?.khoahocquantam
                            ?.TENLOAIKHOAHOC || ""}
                        </p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Khóa học quan tâm</p>
                        <p>
                          {data?.phieudkxettuyen?.khoahocquantam
                            ?.TENLOAIKHOAHOC || ""}
                        </p>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_1fr] gap-0">
                        <p className="font-bold flex items-center">Hồ sơ</p>
                        <div className="text-right w-60">
                          {data?.phieudkxettuyen?.hoso?.map((item, index) => {
                            return (
                              <a
                                key={item?.MAHOSO}
                                href={`/api/v1/file/downLoadFile?MAPHIEUDK=DK268&SDT=0999911286`}
                                className="flex items-center my-2 cursor-pointer text-blue-600"
                              >
                                <div>
                                  <IconFile size={17} />
                                </div>
                                <div className="cursor-pointer text-blue-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {item?.HOSO}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                      <div className="groupInput grid grid-cols-[1fr_auto] gap-0">
                        <p className="font-bold">Kết quả Cao đẳng/Đại học</p>
                        {data?.phieudkxettuyen?.ketquatotnghiep?.MAKETQUA ==
                        1 ? (
                          <Chip variant="flat" color="success">
                            {data?.phieudkxettuyen?.ketquatotnghiep?.KETQUA}
                          </Chip>
                        ) : data?.phieudkxettuyen?.ketquatotnghiep?.MAKETQUA ==
                          3 ? (
                          <Chip variant="flat" color="warning">
                            {data?.phieudkxettuyen?.ketquatotnghiep?.KETQUA}
                          </Chip>
                        ) : (
                          <Chip variant="flat" color="default">
                            Chưa có thông tin
                          </Chip>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="btnRegisterAdmission mt-5 flex">
                <Button color="danger" onPress={logout} className="me-auto">
                  Đăng xuất
                </Button>
                <Button color="primary" onPress={onOpen} className="ms-auto">
                  Phiếu đăng ký xét tuyển
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Phiếu đăng ký xét tuyển
              </ModalHeader>
              <ModalBody>
                <p>Chọn file cần tải lên</p>
                <input type="file" onChange={handleFileChange} multiple />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onClick={handleUploadFile}>
                  Gửi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DetailCustomer;

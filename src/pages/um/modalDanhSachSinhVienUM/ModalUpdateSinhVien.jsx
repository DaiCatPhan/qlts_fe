import { Button, Input, Modal, Select } from "antd";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { API_CUSTOMER, API_DATA } from "../../../constants";
import { toast } from "react-toastify";
import CustomerService from "../../../service/CustomerService";
const { TextArea } = Input;

function ModalUpdateSinhVien(props) {
  const {
    fetchDetailSegment,
    isShowModalUpdate,
    setIsShowModalUpdate,
    SDT,
    data,
  } = props;
  const [nganh, setnganh] = useState([]);
  const [tinh, setTinh] = useState([]);
  const [truong, setTruong] = useState([]);
  const [nghenghiep, setNghenghiep] = useState([]);
  const [hinhthucthuthap, setHinhthucthuthap] = useState([]);
  const [khoaHocQuanTam, setKhoaHocQuanTam] = useState([]);
  const [infoKH, setinfoKH] = useState({}); // dữ liệu gốc

  const [nganhYeuThich, setnganhYeuThich] = useState([]);
  const [thongTinKhachHang, setThongTinKhachHang] = useState({}); // dữ liệu lấy usetate đem cập nhật

  console.log(infoKH);

  const { data: dataJob, mutate: fetchDataJob } = useSWR(
    `${API_DATA}/table-job`
  );
  const { data: dataStatus, mutate: fetchDataStatus } = useSWR(
    `${API_DATA}/status`
  );
  const { data: dataCollection, mutate: fetchDataCollection } = useSWR(
    `${API_DATA}/table-collection`
  );
  const { data: dataJobRegister, mutate: fetchDataJobRegister } = useSWR(
    `${API_DATA}/table-majors`
  );
  const { data: dataCourse, mutate: fetchDataCourse } = useSWR(
    `${API_DATA}/table-course`
  );
  const { data: dataProvince, mutate: fetchDatadataProvince } = useSWR(
    `${API_DATA}/province`
  );
  const { data: dataSchool, mutate: fetchDatadataSchool } = useSWR(
    `${API_DATA}/school`
  );
  const { data: infoKhachHang, mutate: fetchDatainfoKhachHang } = useSWR(
    `${API_CUSTOMER}/${SDT}`
  );

  // goi api lấy thông tin liên hệ theo sdt_um + lan + mapq + sdt_kh

  useEffect(() => {
    if (dataJob) {
      const dataJobTemp = dataJob?.map((item) => {
        return {
          value: item?.MANGHENGHIEP,
          label: item?.TENNGHENGHIEP,
        };
      });
      setNghenghiep(dataJobTemp);
    }
    if (dataCollection) {
      const dataCollectionTemp = dataCollection?.map((item) => {
        return {
          value: item?.MAHINHTHUC,
          label: item?.TENHINHTHUC,
        };
      });
      setHinhthucthuthap(dataCollectionTemp);
    }
    if (dataSchool) {
      const dataSchoolTemp = dataSchool?.map((item) => {
        return {
          value: item?.MATRUONG,
          label: item?.TENTRUONG,
        };
      });
      setTruong(dataSchoolTemp);
    }
    if (dataProvince) {
      const dataProvinceTemp = dataProvince?.map((item) => {
        return {
          value: item?.MATINH,
          label: item?.TENTINH,
        };
      });
      setTinh(dataProvinceTemp);
    }
    if (infoKhachHang) {
      setinfoKH(infoKhachHang);
      setnganhYeuThich(
        infoKhachHang?.nganhyeuthich?.map((item) => {
          return item?.nganh?.MANGANH;
        })
      );
      setThongTinKhachHang(infoKhachHang);
    }
    if (dataCourse) {
      const dataCourseTemp = dataCourse?.map((item) => {
        return {
          value: item.MALOAIKHOAHOC,
          label: item.TENLOAIKHOAHOC,
        };
      });
      setKhoaHocQuanTam(dataCourseTemp);
    }
    if (dataJobRegister) {
      const dataJobRegisterTemp = dataJobRegister?.map((item) => {
        return {
          value: item.MANGANH,
          label: item.TENNGANH,
        };
      });
      setnganh(dataJobRegisterTemp);
    }
  }, [
    dataSchool,
    infoKhachHang,
    dataCourse,
    dataJobRegister,
    dataProvince,
    data,
  ]);

  const handleOk = async () => {
    if (!MATRANGTHAI) {
      return toast.warning("Vui lòng chọn trạng thái liên hệ !!!");
    }
    let data = {
      SDT_KH: SDT,
      SDT: SDT,
      MATRANGTHAI: MATRANGTHAI,
      LAN: lan,
      MaPQ: MaPQ,
    };

    if (CHITIETTRANGTHAI) {
      data.CHITIETTRANGTHAI = CHITIETTRANGTHAI;
    }

    // call api cap nhật
    try {
      const res = await CustomerService.updateContact(data);
      if (res.statusCode == 200) {
        toast.success(res.message);
        await fetchDetailSegment();
        setIsShowModalUpdate(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleCancel = () => {
    fetchDetailSegment([]);
    setIsShowModalUpdate(false);
  };

  // EIDT CHUNG
  const capNhatThongTinCaNhan = async () => {
    try {
      const data = {
        customer: {
          HOTEN: thongTinKhachHang?.HOTEN,
          EMAIL: thongTinKhachHang?.EMAIL,
          SDT: thongTinKhachHang?.SDT,
          MATINH: thongTinKhachHang?.MATINH,
          MATRUONG: thongTinKhachHang?.MATRUONG,
          MANGHENGHIEP: thongTinKhachHang?.MANGHENGHIEP,
          MAHINHTHUC: thongTinKhachHang?.MAHINHTHUC,
        },
        data: {
          SDTBA: thongTinKhachHang?.dulieukhachhang?.SDTBA,
          SDTME: thongTinKhachHang?.dulieukhachhang?.SDTME,
          SDTZALO: thongTinKhachHang?.dulieukhachhang?.SDTZALO,
          FACEBOOK: thongTinKhachHang?.dulieukhachhang?.FACEBOOK,
        },
      };

      const res = await CustomerService.updateCustomer(data);
      fetchDatainfoKhachHang();
      handleCancel();
      toast.success(res.message);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const capNhatNganhYeuThich = async () => {
    if (nganhYeuThich.length == 0) {
      return toast.warning("Vui lòng chọn ngành yêu thích để cập nhật");
    }
    try {
      const data = {
        customer: {
          SDT: SDT,
        },
        nganhyeuthich: nganhYeuThich,
      };
      const res = await CustomerService.editNganhYeuThich(data);
      fetchDatainfoKhachHang();
      toast.success(res.message);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const capNhatPhieuDangKy = () => {
    alert("capNhatPhieuDangKy");
  };

  return (
    <div>
      <div>
        <Modal
          open={isShowModalUpdate}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          style={{
            top: "10px",
          }}
        >
          <div>
            {/* THÔNG TIN CÁ NHÂN */}
            <div className="border p-2 rounded-md my-1">
              <table className="w-full">
                <tr>
                  <td>
                    <b>Thông tin cá nhân</b>
                  </td>
                </tr>
                <tr>
                  <td>Họ tên</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.HOTEN}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          HOTEN: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td>&nbsp;Email</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.EMAIL}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          EMAIL: e.target.value,
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>
                    <Input
                      disabled
                      value={thongTinKhachHang?.SDT}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          SDT: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td>Tỉnh</td>
                  <td>
                    <Select
                      value={thongTinKhachHang?.MATINH}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          MATINH: value,
                        });
                      }}
                      options={tinh}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Trường</td>
                  <td>
                    <Select
                      value={thongTinKhachHang?.MATRUONG}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          MATRUONG: value,
                        });
                      }}
                      options={truong}
                    />
                  </td>
                  <td>CCCD</td>
                  <td>
                    <Input
                      placeholder=""
                      value={thongTinKhachHang?.CCCD}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          CCCD: e.target.value,
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Nghề nghiệp</td>
                  <td>
                    <Select
                      value={thongTinKhachHang?.MANGHENGHIEP}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          MANGHENGHIEP: value,
                        });
                      }}
                      options={nghenghiep}
                    />
                  </td>
                  <td>Hình thức thu thập</td>
                  <td>
                    <Select
                      value={thongTinKhachHang?.MAHINHTHUC}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          MAHINHTHUC: value,
                        });
                      }}
                      options={hinhthucthuthap}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <hr />
                  </td>
                  <td>
                    <hr />
                  </td>
                  <td>
                    <hr />
                  </td>
                  <td>
                    <hr />
                  </td>
                  &nbsp;
                </tr>
                <tr>
                  <td>Số điện thoại ba</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.dulieukhachhang?.SDTBA}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          dulieukhachhang: {
                            ...thongTinKhachHang?.dulieukhachhang,
                            SDTBA: e.target.value,
                          },
                        });
                      }}
                    />
                  </td>
                  <td>Số điện thoại mẹ</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.dulieukhachhang?.SDTME}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          dulieukhachhang: {
                            ...thongTinKhachHang?.dulieukhachhang,
                            SDTME: e.target.value,
                          },
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Face book</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.dulieukhachhang?.FACEBOOK}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          dulieukhachhang: {
                            ...thongTinKhachHang?.dulieukhachhang,
                            FACEBOOK: e.target.value,
                          },
                        });
                      }}
                    />
                  </td>
                  <td>Zalo</td>
                  <td>
                    <Input
                      value={thongTinKhachHang?.dulieukhachhang?.SDTZALO}
                      onChange={(e) => {
                        setThongTinKhachHang({
                          ...thongTinKhachHang,
                          dulieukhachhang: {
                            ...thongTinKhachHang?.dulieukhachhang,
                            SDTZALO: e.target.value,
                          },
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <Button type="primary" onClick={capNhatThongTinCaNhan}>
                      Lưu
                    </Button>
                  </td>
                </tr>
              </table>
            </div>
            {/* NGÀNH YÊU THÍCH */}
            <div className="border p-2 rounded-md my-1">
              <table className="w-full">
                <tr>
                  <td>
                    <b>Ngành yêu thích</b>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td width={200}>Ngành</td>
                  <td>
                    <Select
                      mode="multiple"
                      style={{
                        width: "100%",
                      }}
                      value={nganhYeuThich}
                      onChange={(value) => {
                        setnganhYeuThich(value);
                      }}
                      options={nganh}
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <Button type="primary" onClick={capNhatNganhYeuThich}>
                      Lưu
                    </Button>
                  </td>
                </tr>
              </table>
            </div>
            {/* PHIẾU ĐĂNG KÝ */}
            <div className="border p-2 rounded-md my-1">
              <table className="w-full">
                <tr>
                  <td>
                    <b>Phiếu đăng ký</b>
                  </td>
                  <td></td>
                </tr>

                <tr>
                  <td width={200}>&nbsp;Khóa học quan tâm</td>
                  <td>
                    <Select
                      // defaultValue="lucy"
                      style={{
                        width: "100%",
                      }}
                      onChange={(value) => {}}
                      options={khoaHocQuanTam}
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <Button type="primary">Lưu</Button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ModalUpdateSinhVien;

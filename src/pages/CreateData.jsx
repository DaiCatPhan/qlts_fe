import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
} from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { Table } from "antd";
import { Select } from "antd";

import fs from "fs";
import excel from "../components/ExportFile/ExportFile";

import SegmentService from "../service/SegmentService";

function CreateData() {
  const [file, setFile] = useState(null);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [namHoc, setNamHoc] = useState(2025);
  const [dataResultExcel, setDataResultExcel] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalFail, setTotalFail] = useState(0);

  const [pageSize, setPageSize] = useState(50);
  const handlePageSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật số dòng khi người dùng thay đổi
  };

  const onDrop1 = useCallback((acceptedFiles) => {
    setFiles1((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const onDrop2 = useCallback((acceptedFiles) => {
    setFiles2((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({ onDrop: onDrop1 });
  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({ onDrop: onDrop2 });

  const handleUploadFileDataCustomerNew = async () => {
    if (!file) {
      return toast.error("Vui lòng chọn file !!!");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("namhoc", namHoc);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          folder_type: "dulieu_khachhang",
        },
      };

      // Gọi API sử dụng Axios và truyền formData và config
      setLoading(true);
      const res = await SegmentService.addFileExcelDataCustomerNew(
        formData,
        config
      );
      if (res && res.statusCode === 200) {
        console.log(res);
        const data = res.data.data;
        const totalSuccess = res.data.totalSuccess;
        const totalFail = res.data.totalFail;
        setDataResultExcel(data);
        setTotalSuccess(totalSuccess);
        setTotalFail(totalFail);
      }

      // Xử lý kết quả trả về (nếu cần)
    } catch (error) {
      // Xử lý lỗi nếu có
      if (error.statusCode == 422) {
        toast.error("Lưu ý định dạng file upload là file excel nhé !!!");
      }
      if (error.statusCode == 500) {
        toast.error("Dữ liệu file có vấn đề nhé  !!!");
      }
      console.error("Error while uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "name",
      key: "i",
      width: 5,
      render: (text, record, index) => {
        return <div>{index + 1}</div>; // Tăng dần từ 1
      },
    },
    {
      title: "Dòng Excel",
      dataIndex: "rowExcel",
      key: "rowExcel",
      width: 5,
    },
    {
      title: "Họ và tên(*)  ",
      dataIndex: "data",
      key: "ho_va_ten",
      width: 150,

      render: (data) => {
        return <div>{data?.hoVaTen}</div>;
      },
    },
    {
      title: "CCCD (*)",
      dataIndex: "data",
      key: "address",
      render: (data) => {
        return <div>{data?.CCCD}</div>;
      },
    },
    {
      title: "Điện thoại (*)",
      dataIndex: "data",
      key: "address",
      render: (data) => {
        return <div>{data?.dienThoai}</div>;
      },
    },
    {
      title: "Kênh Nhận Thông Báo(*)",
      dataIndex: "data",
      key: "kenh_nhan_thong_bao",
      width: 150,
      render: (data) => {
        return <div>{data?.kenhNhanThongBao}</div>;
      },
    },
    {
      title: "Khóa Học Quan Tâm (*)",
      dataIndex: "data",
      key: "khoa_hoc_quan_tam",
      render: (data) => {
        return <div>{data?.khoaHocQuanTam}</div>;
      },
    },
    {
      title: "Ngành yêu thích",
      dataIndex: "data",
      key: "nganh_yeu_thich",
      render: (data) =>
        data && data?.nganhYeuThich.length > 0 ? (
          <ul>
            {data?.nganhYeuThich?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div className="text-blue-700"></div>
        ),
    },

    {
      title: "Kết quả",
      dataIndex: "err",
      key: "err",
      width: 250,
      render: (errors) =>
        errors && errors.length > 0 ? (
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-blue-700">Thành công</div>
        ),
    },
  ];

  function xuatExcelLoi() {
    // console.log(123);

    let header = [
      {
        header: "Dòng excel lỗi",
        key: "rowExcel",
      },
      {
        header: "Họ và tên(*)",
        key: "hoVaTen",
      },
      {
        header: "CCCD (*)",
        key: "CCCD",
      },
      {
        header: "Tỉnh/Thành phố ",
        key: "tinhThanh",
      },
      {
        header: "Trường ",
        key: "truong",
      },
      {
        header: "Điện thoại (*)",
        key: "dienThoai",
      },
      {
        header: "Điện thoại ba",
        key: "dienThoaiBa",
      },
      {
        header: "Điện thoại mẹ",
        key: "dienThoaiMe",
      },
      {
        header: "Số Zalo",
        key: "zalo",
      },
      {
        header: "Facebook",
        key: "facebook",
      },
      {
        header: "Email",
        key: "email",
      },
      {
        header: "Nghề nghiệp",
        key: "ngheNghiep",
      },
      {
        header: "Hình thức thu nhập",
        key: "hinhThucThuNhap",
      },
      {
        header: "HS lớp/ SV năm",
        key: "lop",
      },
      {
        header: "Chức vụ",
        key: "chucVu",
      },
      {
        header: "Kênh Nhận Thông Báo (*)",
        key: "kenhNhanThongBao",
      },
      {
        header: "Khóa Học Quan Tâm (*)",
        key: "khoaHocQuanTam",
      },
      {
        header: "Kết Qủa Đại Học/Cao Đẳng",
        key: "ketQuaDaiHocCaoDang",
      },
      {
        header: "Ngành yêu thích",
        key: "nganhYeuThich",
      },
      {
        header: "Lỗi không thêm được",
        key: "err",
      },
    ];
    var tempData = dataResultExcel.filter((item) => {
      return item?.err?.length > 0;
    });

    var result = tempData?.map((item, key) => {
      return {
        rowExcel: item?.rowExcel,
        hoVaTen: item?.data?.hoVaTen,
        CCCD: item?.data?.CCCD,
        tinhThanh: item?.data?.tinhThanh,
        truong: item?.data?.truong,
        dienThoai: item?.data?.dienThoai,
        dienThoaiBa: item?.data?.dienThoaiBa,
        dienThoaiMe: item?.data?.dienThoaiMe,
        zalo: item?.data?.zalo,
        facebook: item?.data?.facebook,
        email: item?.data?.email,
        ngheNghiep: item?.data?.ngheNghiep,
        hinhThucThuNhap: item?.data?.hinhThucThuNhap,
        lop: item?.data?.lop,
        chucVu: item?.data?.chucVu,
        kenhNhanThongBao: item?.data?.kenhNhanThongBao,
        khoaHocQuanTam: item?.data?.khoaHocQuanTam,
        ketQuaDaiHocCaoDang: item?.data?.ketQuaDaiHocCaoDang,
        nganhYeuThich: item?.data?.nganhYeuThich,
        err: item.err,
      };
    });

    excel.EX_Excel({
      header: header,
      data: result,
      nameFile: "du_lieu_khach_hang_them_loi",
    });
  }

  const handleChangeNamHoc = (value) => {
    setNamHoc(value);
  };

  const handleFileChangeFile = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div>
      <Spin spinning={loading} tip="Loading" size="small">
        <div className="flex justify-center">
          <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 bg-gray-50 shadow-sm w-1/3">
            <div className="mb-2 text-center">
              <b>Thêm khách hàng</b>
            </div>

            <table>
              <tr>
                <td>Năm học: </td>
                <td>
                  <Select
                    defaultValue="2025"
                    style={{ width: 120 }}
                    onChange={handleChangeNamHoc}
                    options={[
                      { value: "2027", label: "2027" },
                      { value: "2026", label: "2026" },
                      { value: "2025", label: "2025" },
                      { value: "2024", label: "2024" },
                      { value: "2023", label: "2023" },
                      { value: "2022", label: "2022" },
                      { value: "2021", label: "2021" },
                      { value: "2020", label: "2020" },
                    ]}
                  />
                </td>
              </tr>

              <tr>
                <td>Chọn file: </td>
                <td>
                  <input type="file" onChange={handleFileChangeFile} />
                </td>
              </tr>
            </table>
            <div className="text-xs">
              Lưu ý: cho phép up file dạng .xls .xlsx
            </div>

            <div className="text-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-1 rounded-sm shadow-md 
               transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2"
                onClick={handleUploadFileDataCustomerNew}
              >
                Thêm khách hàng
              </button>
            </div>
          </div>
        </div>

        {dataResultExcel.length > 0 ? (
          <div>
            <div className="font-bold">
              Thành công :{" "}
              <span className="text-green-600">{totalSuccess}</span>
            </div>
            <div className="font-bold">
              Thất bại : <span className="text-danger-600">{totalFail}</span>
            </div>
            <div className="font-bold">
              Tổng số dòng : {totalSuccess + totalFail}
            </div>
            <div className="font-bold">
              Nhấn
              <a className="text-blue-800 text-lg" onClick={xuatExcelLoi}>
                [vào đây]
              </a>
              để xuất excel lỗi
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div style={{ fontSize: "5px" }}>
          <Table
            bordered
            dataSource={dataResultExcel}
            columns={columns}
            size="small"
            pagination={{
              pageSize: pageSize,
              position: ["top", "bottom"],
              showSizeChanger: true,
              onShowSizeChange: handlePageSizeChange,
              pageSizeOptions: ["50", "100", "200"],
            }}
          />
        </div>
      </Spin>
    </div>
  );
}

export default CreateData;

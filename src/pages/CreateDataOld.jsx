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

import fs from "fs";
import excel from "../components/ExportFile/ExportFile";

import SegmentService from "../service/SegmentService";

function CreateData() {
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dataResultExcel, setDataResultExcel] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalFail, setTotalFail] = useState(0);

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

  async function exportDuplicatesToExcel(data) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");

      worksheet.columns = [
        { header: "SDT bị trùng", key: "SDT", width: 20 },
        { header: "Số lần xuất hiện", key: "count", width: 10 },
      ];

      data?.forEach((item) => {
        worksheet.addRow({ SDT: item.SDT, count: item.count });
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Tạo URL tạm thời để tải xuống
        const url = window.URL.createObjectURL(blob);

        // Tạo thẻ a để kích hoạt tải xuống
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "duplicate_phone_numbers.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  const handleUploadFileDataCustomerNew = async () => {
    if (!files1[0]) {
      return toast.error("Vui lòng chọn file !!!");
    }

    const formData = new FormData();
    formData.append("file", files1[0]);

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

  const handleUploadFileDataCustomerOld = async () => {
    if (!files2[0]) {
      return toast.error("Vui lòng chọn file !!!");
    }

    const formData = new FormData();
    formData.append("file", files2[0]);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          folder_type: "dulieu_khachhang",
        },
      };

      // Gọi API sử dụng Axios và truyền formData và config
      setLoading(true);
      const res = await SegmentService.addFileExcelDataCustomerOld(
        formData,
        config
      );

      console.log(res);
      const tableOld = res?.data?.tableCusOld?.info;
      const excel = res?.data?.excel;
      const numbersKH = tableOld?.match(/\d+/g)?.map(Number);

      const newCustomers = numbersKH[0] - numbersKH[1];
      const duplicateCustomers = numbersKH[1];

      const numberDeleteTableCusNew = res?.data?.numberDeleteTableCusNew;

      if (res && res.statusCode == 200) {
        toast.success(
          <>
            Đã xóa {numberDeleteTableCusNew} khách hàng.
            <br />
            Số khách hàng bị trùng SDT trong file Excel: {excel?.length}
          </>,
          {
            autoClose: 10000,
          }
        );

        if (res?.data?.excel?.length > 0) {
          await exportDuplicatesToExcel(res?.data?.excel);
        }
      }
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

  return (
    <>
      <Spin spinning={loading} tip="Loading" size="small">
        <div>
          <div className="w-3/4 m-auto mb-2">
            <Card className="">
              <CardHeader className="flex gap-3 pb-0">
                <div className="flex gap-2">
                  <div>
                    <h1 className="text-lg font-medium">Thêm khách hàng</h1>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div>
                  <div
                    {...getRootProps1()}
                    className=" border-2 border-dashed border-gray-400 rounded "
                  >
                    <input {...getInputProps1()} />
                    {isDragActive1 ? (
                      <div className="flex flex-col items-center justify-center h-40">
                        <FontAwesomeIcon
                          className="w-10 h-10"
                          icon={faCloudArrowUp}
                        />
                        <p>Kéo thả file vào đây...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40">
                        <FontAwesomeIcon
                          className="w-10 h-10"
                          icon={faCloudArrowUp}
                        />
                        <p>Kéo thả file vào đây, hoặc click để chọn file</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-1">
                  <h2 className="font-medium">File đã chọn:</h2>
                  <ul>
                    {files1?.length > 0 ? (
                      files1.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))
                    ) : (
                      <div>
                        <p className="text-center font-medium"></p>
                      </div>
                    )}
                  </ul>
                </div>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  className="w-full"
                  color="primary"
                  onClick={handleUploadFileDataCustomerNew}
                >
                  Upload
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* <Card className="col-span-2 md:col-span-1">
            <CardHeader className="flex gap-3 pb-0">
              <div className="flex gap-2">
                <div>
                  <FontAwesomeIcon
                    className="border-2 p-3 rounded-full w-7 h-7"
                    icon={faCloudArrowUp}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-medium">Thêm khách hàng cũ</h1>
                  <p>Đưa file vào bên dưới</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div>
                <div
                  {...getRootProps2()}
                  className="p-4 border-2 border-dashed border-gray-400 rounded mt-4"
                >
                  <input {...getInputProps2()} />
                  {isDragActive2 ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <FontAwesomeIcon
                        className="w-10 h-10"
                        icon={faCloudArrowUp}
                      />
                      <p>Kéo thả file vào đây...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <FontAwesomeIcon
                        className="w-10 h-10"
                        icon={faCloudArrowUp}
                      />
                      <p>Kéo thả file vào đây, hoặc click để chọn file</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h2 className="font-medium">File đã chọn:</h2>
                <ul className="mt-2">
                  {files2?.length > 0 ? (
                    files2.map((file, index) => (
                      <li key={index} className="mt-1">
                        {file.name}
                      </li>
                    ))
                  ) : (
                    <div>
                      <p className="text-center font-medium"></p>
                    </div>
                  )}
                </ul>
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                className="w-full"
                color="primary"
                onClick={handleUploadFileDataCustomerOld}
              >
                Upload
              </Button>
            </CardFooter>
          </Card> */}
        </div>
      </Spin>

      {dataResultExcel.length > 0 ? (
        <div>
          <div className="font-bold">
            Thành công : <span className="text-green-600">{totalSuccess}</span>
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
        ""
      )}

      <div style={{ fontSize: "5px" }}>
        <Table
          bordered
          dataSource={dataResultExcel}
          columns={columns}
          size="small"
        />
      </div>
    </>
  );
}

export default CreateData;

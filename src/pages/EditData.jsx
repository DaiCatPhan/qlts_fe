import { faBullseye, faAddressCard, faClipboard, faUser, faArrowUpRightFromSquare, faPhone, faClipboardCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardHeader, CardBody, Divider, Tabs, Tab, Chip, Input, Button, Autocomplete, AutocompleteItem, Accordion, AccordionItem, DatePicker, Select, SelectItem, useSwitch } from "@nextui-org/react";
import { Tag } from "antd";
import { useParams } from 'react-router-dom';
import useSWR from "swr";
import { API_CUSTOMER, API_DATA } from "../constants";
import { useEffect, useState } from "react";
import CustomerService from "../service/CustomerService";
import { toast } from "react-toastify";
import { parseDate } from "@internationalized/date";

function EditData() {

    const options = [
        { label: "Đồng ý", value: "Đồng ý" },
        { label: "Không đồng ý", value: "Không đồng ý" },
        { label: "Xem lại", value: "Xem lại" },
    ]

    const selectOther = [
        { label: "Công nghệ thông tin", value: "cntt" },
        { label: "Gần công nghệ thông tin", value: "gcntt" },
    ]

    const detailStatus = [
        { value: "Chưa liên hệ", label: "Chưa liên hệ" },
        { value: "Tài chính", label: "Tài chính" },
        { value: "Cá nhân", label: "Cá nhân" },
        { value: "Bằng cấp", label: "Bằng cấp" },
        { value: "Việc làm", label: "Việc làm" },
        { value: "Liên thông", label: "Liên thông" },
        { value: "Chương trình", label: "Chương trình" },
        { value: "Chất lượng", label: "Chất lượng" },
        { value: "Xem lại", label: "Xem lại" },
        { value: "Thời gian", label: "Thời gian" },
        { value: "Không liên lạc được", label: "Không liên lạc được" },
        { value: "Không nghe máy", label: "Không nghe máy" },
        { value: "Không phải số", label: "Không phải số" },
        { value: "Trùng", label: "Trùng" },
        { value: "Tự liên lạc", label: "Tự liên lạc" },
        { value: "Đang học", label: "Đang học" },
        { value: "Đang bận", label: "Đang bận" },
        { value: "Sinh viên", label: "Sinh viên" },
        { value: "Học sinh lớp 10", label: "Học sinh lớp 10" },
        { value: "Học sinh lớp 11", label: "Học sinh lớp 11" },
        { value: "Không quan tâm", label: "Không quan tâm" },
        { value: "Người đi làm", label: "Người đi làm" },
        { value: "Học trường khác", label: "Học trường khác" },
        { value: "Nhắn lại", label: "Nhắn lại" },
    ]

    const { id } = useParams();
    // API doituong
    const { data: dataThematic, mutate: fetchDataThematic } = useSWR(`${API_DATA}/table-thematic`);
    const { data: dataJob, mutate: fetchDataJob } = useSWR(`${API_DATA}/table-job`);
    // API phieudkxettuyen
    const { data: dataChannel, mutate: fetchDataChannel } = useSWR(`${API_DATA}/table-notification-channel`);
    const { data: dataCourse, mutate: fetchDataCourse } = useSWR(`${API_DATA}/table-course`);
    const { data: dataGraduation, mutate: fetchDataGraduation } = useSWR(`${API_DATA}/table-graduation`);
    const { data: dataJobRegister, mutate: fetchDataJobRegister } = useSWR(`${API_DATA}/table-majors`);
    const { data: dataTypeMajors, mutate: fetchDataTypeMajors } = useSWR(`${API_DATA}/table-type-majors`)
    // console.log("dataGraduation", dataJobRegister)
    const { data: dataStatus, mutate: fetchDataStatus } = useSWR(`${API_DATA}/status`)

    const { data: detailData, mutate } = useSWR(`${API_CUSTOMER}/${id}`)
    console.log(detailData)
    const [fullName, setFullName] = useState("")
    const [province, setProvince] = useState("")
    const [school, setSchool] = useState("")
    const [phone, setPhone] = useState("")
    const [phoneFather, setPhoneFather] = useState("")
    const [phoneMother, setPhoneMother] = useState("")
    const [faceBook, setFaceBook] = useState("")
    const [zalo, setZalo] = useState("")
    const [email, setEmail] = useState("")
    const [thematic, setThematic] = useState(new Set([]))
    const [job, setJob] = useState("")
    const [option, setOption] = useState([])
    const [channel, setChannel] = useState("")
    const [course, setCourse] = useState()
    const [graduation, setGraduation] = useState("")
    const [jobRegister, setJobRegister] = useState("")
    const [typeJob, setTypeJob] = useState("")
    const [jobInput, setJobInput] = useState("")

    useEffect(() => {
        if (detailData) {
            setFullName(detailData?.HOTEN)
            setProvince(detailData?.tinh?.TENTINH)
            setSchool(detailData?.truong?.TENTRUONG)
            setPhone(detailData?.SDT)
            setPhoneFather(detailData?.dulieukhachhang?.SDTBA)
            setPhoneMother(detailData?.dulieukhachhang?.SDTME)
            setFaceBook(detailData?.dulieukhachhang?.FACEBOOK)
            setZalo(detailData?.dulieukhachhang?.SDTZALO)
            setEmail(detailData?.EMAIL)
            if (detailData?.chitietchuyende.length > 0) {
                setThematic(detailData.chitietchuyende[0].MACHUYENDE)
                setOption([detailData?.chitietchuyende[0].TRANGTHAI])
            }
            if (detailData?.nghenghiep != null) {
                setJob(detailData?.nghenghiep.MANGHENGHIEP || "")
            }

            setChannel(detailData?.phieudkxettuyen.MAKENH)
            setCourse(`${detailData?.phieudkxettuyen.MALOAIKHOAHOC}`)
            setGraduation(`${detailData?.phieudkxettuyen.MAKETQUA}`)
            setJobRegister(detailData?.phieudkxettuyen.NGANHDK)
        }
    }, [detailData])

    // useEffect(() => {
    //     console.log("detailData.chitietchuyende[0].MACHUYENDE", detailData.chitietchuyende)
    // }, [detailData])

    useEffect(() => {
        console.log("Thematic", thematic)
    }, [thematic])


    const contactDetails = [1, 2, 3, 4, 5, 6, 7].map(lan => {
        const contact = detailData?.lienhe.find(c => c.LAN == lan);
        return {
            LAN: lan,
            THOIGIAN: contact ? parseDate(contact.THOIGIAN) : null,
            CHITIETTRANGTHAI: contact ? contact.CHITIETTRANGTHAI : "",
            KETQUA: contact ? contact.KETQUA : "",
            TRANGTHAI: contact ? contact.MATRANGTHAI : ""
        };
    });

    const itemClasses = {
        base: "py-0 w-full",
        title: "font-normal text-medium",
        trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
        indicator: "text-medium",
        content: "text-small px-2",
    };


    const handleUpdateInfo = async () => {
        try {
            const data = {
                customer: {
                    SDT: phone,
                    HOTEN: fullName,
                    EMAIL: email
                },
                data: {
                    SDTBA: phoneFather,
                    SDTME: phoneMother,
                    SDTZALO: zalo,
                    FACEBOOK: faceBook
                }
            }

            const res = await CustomerService.updateCustomer(data);
            mutate();
            toast.success(res.message)
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleUpdateObject = async () => {
        try {
            const SDTUM = dataThematic?.find((item) => item.MACHUYENDE == thematic).SDT;
            const data = {
                chuyendethamgia: {
                    SDT: phone,
                    TRANGTHAI: option,
                    MACHUYENDE: thematic,
                    SDT_UM: SDTUM
                },
                nganhyeuthich: {

                }
            }

            const dataInfo = {
                customer: {
                    SDT: phone,
                    MANGHENGHIEP: job,
                },
                data: {

                }
            }

            const res = await CustomerService.updateObject(data);
            const resCustomer = await CustomerService.updateCustomer(dataInfo);
            if (res.statusCode === 200 && resCustomer.statusCode === 200) {
                mutate();
                toast.success("Cập nhật thông tin thành công")
            } else {
                toast.error("Cập nhật thất bại")
            }

        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleUpdateRegister = async () => {
        try {
            if (jobRegister != "NG08") {
                const data = {
                    SDT: phone,
                    MALOAIKHOAHOC: course,
                    MAKENH: channel,
                    MAKETQUA: graduation,
                    NGANHDK: jobRegister
                }
                const res = await CustomerService.updateRegister(data);
                mutate();
                toast.success(res.message)
            } else {
                console.log("JobType", typeJob)
                console.log("jobInput", jobInput)
            }


        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleDownloadFile = async (data) => {
        const MAHOSO = data?.MAHOSO;
        if (!MAHOSO) {
            return toast.warning("MAHOSO chưa có nhé");
        }
        try {
            const response = await SegmentService.downLoadFile({
                MAHOSO: MAHOSO,
            });

            console.log("response", response);

            // Kiểm tra xem response có dữ liệu file không
            if (!response || !response.data) {
                return toast.error("Không có dữ liệu tệp để tải xuống.");
            }

            // Chuyển đổi dữ liệu nhận được thành một đối tượng Blob
            const blob = new Blob([response.data]);

            // Tạo URL để hiển thị hoặc tải xuống file
            const url = window.URL.createObjectURL(blob);

            // Tạo một phần tử <a> ẩn để khởi tạo việc tải xuống file
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = response.filename || "downloaded_file"; // Tên file để tải về

            // Thêm phần tử <a> vào DOM và kích hoạt sự kiện click để tải xuống file
            document.body.appendChild(a);
            a.click();

            // Sau khi hoàn tất, loại bỏ phần tử <a> đã tạo
            document.body.removeChild(a);

            // Giải phóng URL đã tạo
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", { error: error?.message });
            toast.error("Đã xảy ra lỗi khi tải xuống file.", error);
        }
    };

    let tabs = [
        {
            id: "profile",
            label: "Thông tin cá nhân",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Họ tên" value={fullName} variant="bordered"
                                onValueChange={setFullName} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Tỉnh" value={province}
                                onValueChange={setProvince} isDisabled />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Trường" value={school}
                                onValueChange={setSchool} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Số điện thoại" value={phone}
                                onValueChange={setPhone} isDisabled />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Số điện thoại ba" value={phoneFather || ''} variant="bordered"
                                onValueChange={setPhoneFather} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Số điện thoại mẹ" value={phoneMother || ''} variant="bordered"
                                onValueChange={setPhoneMother} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Facebook" value={faceBook || ''} variant="bordered"
                                onValueChange={setFaceBook} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Zalo" value={zalo || ''} variant="bordered"
                                onValueChange={setZalo} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Email" value={email} variant="bordered"
                                onValueChange={setEmail} />
                        </div>
                        <div className="col-span-2 md:col-span-1 flex items-end">
                            <Button color="primary" onClick={handleUpdateInfo}>Xác nhận</Button>
                        </div>
                    </div>
                </div>


            )
        },
        {
            id: "object",
            label: "Đối tượng",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                items={dataThematic || []}
                                label="Chuyên đề tham gia"
                                variant="bordered"
                                labelPlacement="inside"
                                selectedKeys={[thematic]}
                                onChange={(e) => setThematic(e.target.value)}
                                classNames={{
                                    trigger: "h-12",
                                }}
                                renderValue={(items) => {
                                    return items.map((item) => (
                                        <div key={item.data.MACHUYENDE} className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-default-500">{item.data.TENCHUYENDE} - Được quản lý bởi: {item.data.usermanager != null ? item.data.usermanager.HOTEN : ''}</span>
                                            </div>
                                        </div>
                                    ));
                                }}
                            >
                                {(thematic) => (
                                    <SelectItem key={thematic.MACHUYENDE} textValue={thematic.MACHUYENDE}>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-default-400">{thematic.TENCHUYENDE} - Được quản lý bởi:  {thematic.usermanager != null ? thematic.usermanager.HOTEN : ''}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Select
                                label="Lựa chọn"
                                variant="bordered"
                                selectedKeys={option}

                                onChange={(e) => setOption([e.target.value])}
                            >
                                {options.map((option) => (
                                    <SelectItem key={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Nghề nghiệp"
                                variant="bordered"
                                selectedKey={job}
                                onSelectionChange={setJob}
                            >
                                {dataJob?.map((job) => (
                                    <AutocompleteItem key={job.MANGHENGHIEP} value={job.MANGHENGHIEP}>
                                        {job.TENNGHENGHIEP}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Hình thức thu thập" defaultValue={detailData?.hinhthucthuthap.TENHINHTHUC} isDisabled />
                        </div>
                    </div>
                    <div className=" mb-3">
                        <p>
                            Ngành yêu thích
                        </p>
                        <div className="mt-2">
                            {detailData?.nganhyeuthich.length != 0 ? detailData?.nganhyeuthich.map((job, index) => (
                                <Tag key={index} bordered={false} color="processing">
                                    {job?.nganh?.TENNGANH}
                                </Tag>
                            )) : ''}
                        </div>

                    </div>
                    <Button color="primary" onClick={handleUpdateObject}>Xác nhận</Button>
                </div>
            )
        },
        {
            id: "fromAdmission",
            label: "Phiếu đăng ký xét tuyển",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Kênh nhận thông báo"

                                variant="bordered"
                                selectedKey={channel}
                                onSelectionChange={setChannel}
                            >
                                {dataChannel?.map((channel) => (
                                    <AutocompleteItem key={channel.MAKENH} value={channel.MAKENH}>
                                        {channel.TENKENH}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Khóa học quan tâm"

                                variant="bordered"
                                selectedKey={course}
                                onSelectionChange={setCourse}
                            >
                                {dataCourse?.map((course) => (
                                    <AutocompleteItem key={course.MALOAIKHOAHOC} value={course.MALOAIKHOAHOC}>
                                        {course.TENLOAIKHOAHOC}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Kết quả Cao đẳng/Đại học"

                                variant="bordered"
                                selectedKey={graduation}
                                onSelectionChange={setGraduation}
                            >
                                {dataGraduation?.map((graduation) => (
                                    <AutocompleteItem key={graduation.MAKETQUA} value={graduation.MAKETQUA}>
                                        {graduation.KETQUA}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Accordion
                                showDivider={false}
                                className="flex flex-col gap-1 w-full"
                                itemClasses={itemClasses}
                            >
                                <AccordionItem
                                    key="1"
                                    aria-label="Hồ sơ"
                                    startContent={<FontAwesomeIcon size="lg" icon={faClipboardCheck} />}

                                    title="Hồ sơ"
                                >
                                    {/* {detailData?.phieudkxettuyen.hoso > 0 ? detailData?.phieudkxettuyen.hoso : 'Chưa có thông tin'} */}
                                    <div className="max-w-[300px]">
                                        {detailData?.phieudkxettuyen?.hoso?.map((item, index) => {
                                            const fullPath = item?.HOSO;
                                            const parts = fullPath.split("\\");
                                            const fileName = parts[parts.length - 1];
                                            return (
                                                <div className="flex justify-end" key={index}>
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#d60000", }} className="mt-1 me-2 cursor-pointer" />
                                                    <p
                                                        key={index}
                                                        onClick={() => handleDownloadFile(item)}
                                                        className="cursor-pointer text-blue-600 overflow-hidden text-ellipsis whitespace-nowrap"
                                                    >
                                                        {fileName}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </AccordionItem>

                            </Accordion>
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Ngành đăng ký"

                                variant="bordered"
                                selectedKey={jobRegister}
                                onSelectionChange={setJobRegister}
                            >
                                {dataJobRegister?.map((jobRegister) => (
                                    <AutocompleteItem key={jobRegister.MANGANH} value={jobRegister.MANGANH}>
                                        {jobRegister.TENNGANH}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        {jobRegister === 'NG08' ? (
                            <div className="col-span-2 md:col-span-1">
                                <Autocomplete
                                    label="Chọn loại ngành"
                                    variant="bordered"
                                    defaultItems={dataTypeMajors}

                                    selectedKey={typeJob}
                                    onSelectionChange={setTypeJob}
                                >
                                    {(item) => <AutocompleteItem key={item.MANHOMNGANH} value={item.MANHOMNGANH}>{item.TENNHOMNGANH}</AutocompleteItem>}
                                </Autocomplete>
                            </div>
                        ) : ""}
                    </div>
                    {jobRegister === 'NG08' ? (
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    label="Tên ngành"
                                    variant="bordered"
                                    value={jobInput}
                                    onValueChange={setJobInput}
                                />
                            </div>

                        </div>
                    ) : ""}
                    <Button color="primary" onClick={handleUpdateRegister}>Xác nhận</Button>

                </div >
            )
        }
    ];
    let contacts = [
        {
            id: "contact1",
            label: "Liên hệ lần 1",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[0].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <div className="col-span-2 md:col-span-1">
                                <Autocomplete
                                    label="Trạng thái"
                                    selectedKey={contactDetails[0].TRANGTHAI} isDisabled
                                >
                                    {dataStatus?.map((status) => (
                                        <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                            {status.TENTRANGTHAI}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            </div>

                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <Autocomplete
                            label="Chi tiết trạng thái"
                            selectedKey={contactDetails[0].CHITIETTRANGTHAI}
                            isDisabled
                        >
                            {detailStatus?.map((detail) => (
                                <AutocompleteItem key={detail.value} value={detail.value}>
                                    {detail.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[0].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact2",
            label: "Liên hệ lần 2",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[1].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[1].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[1].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[1].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact3",
            label: "Liên hệ lần 3",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[2].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[2].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[2].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[2].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact4",
            label: "Liên hệ lần 4",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[3].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[3].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[3].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[3].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact5",
            label: "Liên hệ lần 5",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[4].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[4].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[4].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[4].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact6",
            label: "Liên hệ lần 6",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[5].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[5].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[5].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[5].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "contact7",
            label: "Liên hệ lần 7",
            content: (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <DatePicker className="max-w-[284px]" label="Ngày liên hệ" value={contactDetails[6].THOIGIAN} onChange={() => { }} isDisabled />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Trạng thái"
                                selectedKey={contactDetails[6].TRANGTHAI} isDisabled
                            >
                                {dataStatus?.map((status) => (
                                    <AutocompleteItem key={status.MATRANGTHAI} value={status.MATRANGTHAI}>
                                        {status.TENTRANGTHAI}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="col-span-2 md:col-span-1">
                            <Autocomplete
                                label="Chi tiết trạng thái"
                                selectedKey={contactDetails[6].CHITIETTRANGTHAI}
                                isDisabled
                            >
                                {detailStatus?.map((detail) => (
                                    <AutocompleteItem key={detail.value} value={detail.value}>
                                        {detail.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Input type="text" label="Kết quả" value={contactDetails[6].KETQUA} onChange={() => { }} isDisabled />
                        </div>
                    </div>
                </div>
            )
        }
    ];



    return (
        <>
            <div className="">
                <div className="grid grid-cols-5 mt-4 gap-4">
                    <div className="col-span-5 md:col-span-3">
                        <Card>
                            <CardBody>
                                <Tabs aria-label="Dynamic tabs" items={tabs} variant="light">
                                    {(item) => (
                                        <Tab key={item.id} title={item.label}>
                                            <div>
                                                {item.content}
                                            </div>

                                        </Tab>
                                    )}
                                </Tabs>
                            </CardBody>
                        </Card>



                    </div>
                    <div className="col-span-5 md:col-span-2">
                        <Card>
                            <CardBody>
                                <Tabs aria-label="Dynamic tabs" items={contacts} variant="light">
                                    {(item) => (
                                        <Tab key={item.id} title={item.label}>
                                            <div>
                                                {item.content}
                                            </div>

                                        </Tab>
                                    )}
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div >


        </>
    );
}

export default EditData;
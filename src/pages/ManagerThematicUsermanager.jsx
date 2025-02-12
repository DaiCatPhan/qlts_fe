import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    useDisclosure,
    Tooltip,
} from "@nextui-org/react";
import { SearchIcon } from "../components/icons/SearchIcon";
import { ChevronDownIcon } from "../components/icons/ChevronDownIcon";
import ModalComponent from "../components/Modal/ModalComponent";
import { EditIcon } from "../components/icons/EditIcon";
import { DeleteIcon } from "../components/icons/DeleteIcon";
import useSWR from 'swr'
import { API_THEMATIC, API_DATA, API_USER } from "../constants";
import debounce from "lodash.debounce";
import moment from "moment";
import FormThematic from "../components/body/FormThematic";
import ThematicService from "../service/ThematicService";
import { toast } from "react-toastify";
import FormThematicEdit from "../components/body/FormThematicEdit";
import ModalThematic from "../components/Modal/ModalThematic";
import { Popconfirm } from "antd";
import { useSelector } from "react-redux";
const INITIAL_VISIBLE_COLUMNS = ["id", "tenchuyende", "tentruong", "usermanager", "ngaythongbao", "ngaytochuc", "noidung"];
function ManagerThematicUsermanager() {
    const user = useSelector((state) => state.account.user);
    const { data: dataThematic, mutate: fetchDataThematic } = useSWR(`${API_THEMATIC}/readAll?SDT=${user.SDT}`)
    const [record, setRecord] = useState();

    // Modal
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();

    const [filterSearchName, setFillterSearchName] = useState('')
    const data = useMemo(() => {
        return dataThematic?.data?.map((thematic, index) => {
            return {
                id: index + 1,
                machuyende: thematic?.MACHUYENDE,
                tenchuyende: thematic?.TENCHUYENDE,
                tentruong: thematic?.MATRUONG,
                usermanager: thematic?.usermanager?.HOTEN || '',
                ngaythongbao: thematic?.THOIGIANTHONGBAO,
                ngaytochuc: thematic?.THOIGIANTOCHUCCHUYENDE,
                noidung: thematic?.NOIDUNG,
                sdt: thematic?.SDT

            }
        }) || []
    }, [dataThematic])

    const columns = [
        { name: "STT", uid: "id", sortable: true },
        { name: "Tên chuyên đề", uid: "tenchuyende" },
        { name: "Tên trường", uid: "tentruong", },
        { name: "User manager", uid: "usermanager" },
        { name: "Ngày thông báo", uid: "ngaythongbao", sortable: true },
        { name: "Ngày tổ chức", uid: "ngaytochuc", sortable: true },
        { name: "Nội dung", uid: "noidung" },

    ];

    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterSearchName);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...data];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((data) =>
                data.tenchuyende.toLowerCase().includes(filterSearchName.toLowerCase()),
            );
        }

        return filteredUsers;
    }, [data, filterSearchName]);

    const items = useMemo(() => {

        return filteredItems;
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const paginatedItems = useMemo(() => {
        const startIdx = (page - 1) * rowsPerPage;
        const endIdx = startIdx + rowsPerPage;
        return sortedItems.slice(startIdx, endIdx);
    }, [sortedItems, page, rowsPerPage]);

    const renderCell = useCallback((thematic, columnKey) => {
        const cellValue = thematic[columnKey];

        switch (columnKey) {
            case "thoigianphan":
                return (
                    <div className="flex flex-col justify-center">
                        <span className="text-bold text-small capitalize">{cellValue}</span>

                    </div>
                );
            case "tentruong":
                return (
                    <div className="flex flex-col justify-center">
                        <span className="text-bold text-small capitalize">{cellValue}</span>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    useEffect(() => {
        if (dataThematic) {
            const totalPages = Math.ceil(dataThematic.length / rowsPerPage);
            setTotal(totalPages > 0 ? totalPages : 1);
        }
    }, [dataThematic, rowsPerPage]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback(
        (value) => {
            if (value) {
                setFillterSearchName(value)
                setPage(1);
            } else {
                setFillterSearchName("")

            }
        }, []);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    page={page}

                    total={total}

                    variant="light"
                    onChange={(e) => {
                        setPage(e)
                    }}
                />
                <div className="flex justify-between items-center mb-2 gap-5">
                    <span className="text-default-400 text-small">Total {data.length} data</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                            value={rowsPerPage}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [items.length, page, hasSearchFilter, rowsPerPage, total]);

    return (
        <>
            <div className="">
                <div className="mt-3" style={{
                    padding: 24,
                    minHeight: 385,
                    background: "#fff",
                    borderRadius: "10px"
                }}>

                    <h1 className="mb-2 text-lg font-medium">Quản lý chuyên đề</h1>

                    <div className="flex flex-col gap-4 mt-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between gap-3 items-end">
                                <Input
                                    isClearable
                                    classNames={{
                                        base: "w-full sm:max-w-[30%]",
                                        inputWrapper: "border-1",
                                    }}
                                    placeholder="Tìm kiếm theo tên chuyên đề"
                                    size="sm"
                                    startContent={<SearchIcon className="text-default-300" />}
                                    variant="bordered"
                                    onClear={() => setFillterSearchName("")}
                                    onValueChange={debounce(onSearchChange, 300)}
                                />
                                <div className="flex gap-3">
                                    <Dropdown>
                                        <DropdownTrigger className="hidden sm:flex">
                                            <Button
                                                endContent={<ChevronDownIcon className="text-small" />}
                                                size="sm"
                                                variant="flat"
                                            >
                                                Columns
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="Table Columns"
                                            closeOnSelect={false}
                                            selectedKeys={visibleColumns}
                                            selectionMode="multiple"
                                            onSelectionChange={setVisibleColumns}
                                        >
                                            {columns.map((column) => (
                                                <DropdownItem key={column.uid} className="capitalize">
                                                    {column.name}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>

                                </div>
                            </div>
                            <div className="flex justify-between items-center">

                            </div>
                        </div>
                    </div >

                    <Table
                        // isCompact
                        removeWrapper
                        aria-label="Example table with custom cells, pagination and sorting"
                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"
                        checkboxesProps={{
                            classNames: {
                                wrapper: "after:bg-foreground after:text-background text-background",
                            },
                        }}
                        sortDescriptor={sortDescriptor}

                        topContentPlacement="outside"
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader columns={headerColumns}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                    allowsSorting={column.sortable}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"Không tìm thấy người dùng"} items={paginatedItems}>
                            {(item) => (
                                <TableRow key={item.madoan}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

export default ManagerThematicUsermanager;
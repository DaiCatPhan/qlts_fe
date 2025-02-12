import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  Result,
  Space,
  theme,
} from "antd";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import Breadcrumbs from "../../components/Breadcrumb/Breadcrumb";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { Avatar } from "@nextui-org/react";
import { IconFile } from "@tabler/icons-react";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <Link to={"/usermanager"}>Dashboard</Link>,
    "/usermanager",
    <DashboardOutlined />
  ),

  getItem(
    <Link to={"/usermanager/danhsachsinhvien"}>Danh sách sinh viên</Link>,
    "/usermanager/danhsachsinhvien",
    <DatabaseOutlined />
  ),

  getItem(
    <Link to={"/usermanager/doandulieu"}>Danh sách đoạn</Link>,
    "/usermanager/doandulieu",
    <DatabaseOutlined />
  ),

  getItem(
    <Link to={"/usermanager/danhsachsinhvientheodoan"}>
      DSSV theo lần liên hệ
    </Link>,
    "/usermanager/danhsachsinhvientheodoan",
    <DatabaseOutlined />
  ),

  getItem(
    <Link to={"/usermanager/file"}>Danh sách hồ sơ</Link>,
    "/usermanager/file",
    <IconFile size={16} />
  ),
  getItem(
    <Link to={"/usermanager/thematic"}>Quản lí chuyên đề</Link>,
    "/usermanager/thematic",
    <FontAwesomeIcon icon={faClipboard} />
  ),
  getItem(
    <Link to={"/usermanager/dulieuchamcong"}>Dữ liệu chấm công</Link>,
    "/usermanager/dulieuchamcong",
    <FontAwesomeIcon icon={faClipboard} />
  ),
];

const LayoutUserManager = () => {
  const { logout } = useAuth();

  let location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const { profile, isLoading } = useAuth();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // KIỂM TRA QUYỀN ĐĂNG NHẬP
  // if (!isAuthenticated) {
  //     return (
  //         <div>
  //             <Result
  //                 status="403"
  //                 title="403"
  //                 subTitle="Sorry, you are not authorized to access this page."
  //                 extra={<Button type="primary">Back Home</Button>}
  //             />
  //         </div>
  //     );
  // }
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        width={230}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical mb-1 flex justify-center">
          <img
            src="/image/CUSC_No_Background.png"
            className={`${collapsed ? "w-10" : "w-20 ms-5"}`}
          />
          {/* <h1 className='text-white text-lg font-bold'>HTQL Tuyển sinh</h1> */}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          className="p-0"
          onClick={handleClick}
          selectedKeys={[current]}
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          className="flex justify-end"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Dropdown
            className="flex items-center gap-2 me-5 cursor-pointer"
            menu={{
              items: [
                {
                  label: (
                    <Link to={"/usermanager/profile"}>
                      <UserOutlined /> Profile
                    </Link>
                  ),
                  key: "0",
                },
                {
                  label: (
                    <div onClick={() => logout()}>
                      <LogoutOutlined /> Logout
                    </div>
                  ),
                  key: "1",
                },
              ],
            }}
            trigger={["click"]}
          >
            <div onClick={(e) => e.preventDefault()}>
              <Avatar
                isBordered
                color="primary"
                // src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                src="https://i.pinimg.com/564x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
              />
              <div className="font-medium">
                <p className="text-sm">{user && user.HOTEN}</p>
                <p className="text-tiny text-gray-400">{user && user.ROLE}</p>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "0 16px",
            backgroundColor: "#F0F3F7",
          }}
        >
          <Breadcrumbs />
          <div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutUserManager;

import { Button, Layout, Menu, Spin, Tooltip, Typography } from "antd";
import { InboxOutlined, SendOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { Path } from "@/interfaces";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;

export default function AppLayout({ children }: PropsWithChildren) {
  const { pathname, push } = useRouter();
  const { user } = useUser();

  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text>Authenticating...</Text>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        // onBreakpoint={(broken) => {
        //   console.log(broken);
        // }}
        // onCollapse={(collapsed, type) => {
        //   console.log(collapsed, type);
        // }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="./Logo.svg" alt="Logo" width={150} height={64} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname.split("/")?.[1]]}
          items={[
            {
              key: "orders",
              icon: <InboxOutlined />,
              label: "Užsakymai",
              onClick: () => push(Path.ORDERS),
            },
            {
              key: "shipments",
              icon: <SendOutlined />,
              label: "Siuntos",
              onClick: () => push(Path.SHIPMENTS),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#001529" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 5,
            }}
          >
            <Text style={{ color: "#e6f4ff" }}>{user?.name}</Text>
            <Tooltip title="Logout">
              <Button
                shape="circle"
                icon={<LogoutOutlined />}
                size="small"
                onClick={() => push(Path.API_AUTH_LOGOUT)}
              />
            </Tooltip>
          </div>
        </Header>
        <Content style={{ padding: 20 }}>
          <div>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

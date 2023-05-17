import { InboxOutlined, SendOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Layout, Menu, Spin, Tooltip, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { Path } from "@/interfaces";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AppLayout({ children }: PropsWithChildren) {
  const { pathname, push } = useRouter();
  const { user } = useUser();
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const handleMenuItemSelect = (items: string[]) => {
    setSelectedKey(items);
  };

  useEffect(() => {
    handleMenuItemSelect([pathname.split("/")?.[1]]);
  }, [pathname]);

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
        {children}
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
          selectedKeys={selectedKey}
          onSelect={(info) => handleMenuItemSelect(info.keyPath)}
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
        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
}

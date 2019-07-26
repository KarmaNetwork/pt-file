import React from 'react';
import { Layout } from 'antd';
import router from 'umi/router';
import ss from '@/styles/layout.less';

const BasicLayout = props => {

  const home = () => router.push('/');
  
  return (
    <Layout className={ss.page}>
      <Layout.Header>
	<h1 className={ss.title} onClick={home}>pt-file</h1>
      </Layout.Header>
      <Layout.Content>
	{props.children}
      </Layout.Content>
    </Layout>
  );
};

export default BasicLayout;

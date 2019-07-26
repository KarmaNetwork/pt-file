import React from 'react';
import { Upload, Icon } from 'antd';
import f from '@/utils/file';
import ss from '@/styles/index.less';

export default function() {
  const action = async file => {
    let res = await f(file);
    await alert(res);
  }
  
  const onChange = (info) => {
    // console.log(info);
  }
  
  return (
    <div className={ss.dropage}>
      <main className={ss.dropbox}>
	<Upload.Dragger name="files" action={action} onChange={onChange}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
	</Upload.Dragger>
      </main>
    </div>
  );
}

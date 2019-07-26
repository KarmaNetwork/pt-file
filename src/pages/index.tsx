import React from 'react';
import { Upload, Select, Icon } from 'antd';

const { Option } = Select;

export default function() {
  const onChange = (info) => {
    console.log(info);
  }
  
  return (
    <div className="dropbox">
      <Upload.Dragger name="files" action="/upload.do" onChange={onChange}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Upload.Dragger>
    </div>
  );
}

import React from 'react';
import FileTransfer from '@/utils/file';

export default class Receiver extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  
  componentDidMount() {
    let ft = new FileTransfer('http://localhost:8000', false);
    this.ft = ft;
    let hex = this.props.location.pathname.slice(1);
    ft.bootstrap(hex);
  }
  
  render() {
    return (
      <div>hello</div>
    )
  }
}

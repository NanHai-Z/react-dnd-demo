import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import TreeSelectModule from './TreeSelectModule';
import DragModule from './DragModule';

const { Text } = Typography;

const SelectDnd = () => {
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    const length = 10;
    const arr = [];

    for (let i = 0; i < length; i++) {
      arr.push({
        key: i + 1,
        title: `这是第${i}列`
      })
    }
    setData(arr);
    setTreeData(arr);
  }, []);


  const onSearch = (v) => {
    setTreeData(data.filter(i => i.title.includes(v)));
  };

  const onSelectChange = (v) => {
    setSelectedKeys(v);
  };

  return (
    <Row style={{ margin: '100px', width: '50%' }}>
      <Col span={14}>
        <TreeSelectModule treeData={treeData} onSearch={onSearch} selectedKeys={selectedKeys} onSelectChange={onSelectChange} />
      </Col>
      <Col span={10}>
        <Text strong style={{ lineHeight: '40px' }}>已选择的标签： </Text>
        <DragModule data={data.filter(a => selectedKeys.find(b => a.key === b))} selectedKeys={selectedKeys} onSelectChange={onSelectChange} />
      </Col>
    </Row>
  )
};

export default SelectDnd;

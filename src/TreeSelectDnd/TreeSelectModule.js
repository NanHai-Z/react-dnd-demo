import React from 'react';
import { Tree, Input } from 'antd';

const { Search } = Input;


const TreeSelectModule = ({ onSelectChange, selectedKeys, treeData, onSearch }) => {

  return (
    <>
      <Search
        style={{ marginBottom: 8 }}
        onChange={e => onSearch(e.target.value)}
        placeholder="请输入风险分类关键词"
      />
      <Tree
        height={340}
        treeData={treeData}
        onSelect={onSelectChange}
        multiple
        selectedKeys={selectedKeys}
      />
    </>
  );
};

export default TreeSelectModule;

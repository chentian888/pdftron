// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useState } from 'react';

export default () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  const [tab, setTab] = useState<string>('1');
  const [bread, setBread] = useState<BreadCrumbsType[]>([]);
  return {
    name,
    setName,
    tab,
    setTab,
    bread,
    setBread,
  };
};

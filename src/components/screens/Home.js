import React from 'react';
import Input from '../Input';
import Table from '../Table';
import { useState } from 'react';
export default function Home() {
  const [filter, setFilter] = useState('');
  console.log(filter);
  return (
    <div>
      <div>
        <Input filter={filter} setFilter={setFilter} />
        <Table filter={filter} />
      </div>
    </div>
  );
}

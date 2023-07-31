import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const url = 'https://jsonplaceholder.typicode.com/posts';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    width: 110,
    label: 'ID',
  },
  {
    id: 'title',
    width: 400,
    label: 'Заголовок',
  },
  {
    id: 'body',
    width: 600,
    label: 'Описание',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            width={headCell.width}
            key={headCell.id}
            align='center'
            sx={{ background: '#474955', color: 'white' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ color: 'white !important' }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ filter }) {
  const [data, setData] = useState([]);
  const [filterArr, setfilterArr] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        let foo = [...res.data];
        let newData = foo.splice(0, 10);
        setData(res.data);
        setViewData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
    setSearchParams(`?page=1`);
  }, []);

  useEffect(() => {
    let foo = [...filterArr];
    let currentPage = searchParams.get('page') || 1;
    let newData = foo.splice((currentPage - 1) * 10, 10);
    setViewData(newData);
  }, [filterArr, searchParams]);

  useEffect(() => {
    setSearchParams('?page=1');
    let filterData = data.filter((e) => {
      return (
        e.title.indexOf(filter) > -1 ||
        e.body.indexOf(filter) > -1 ||
        e.id.toString().indexOf(filter) > -1
      );
    });

    setfilterArr(filterData);
  }, [filter, data]);

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
    () => stableSort(viewData, getComparator(order, orderBy)),
    [order, orderBy, viewData]
  );

  const pageCount = () => {
    let count = 0;
    let arr = [];
    if (filterArr.length % 10 === 0) {
      count = filterArr.length / 10;
    } else {
      count = Math.ceil(filterArr.length / 10);
    }
    arr.length = count;
    arr.fill(1);
    return arr;
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='medium'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      sx={{
                        padding: '5px',
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                      }}
                      align='center'
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '5px',
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      {row.title}
                    </TableCell>
                    <TableCell sx={{ padding: '5px' }}>{row.body}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 100px',
        }}
      >
        <Button
          variant='text'
          disabled={searchParams.get('page') * 1 === 1}
          onClick={() => {
            let currentPage = searchParams.get('page');
            setSearchParams(`?page=${currentPage * 1 - 1}`);
          }}
          sx={{
            color: '#474955',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          Назад
        </Button>
        <Box>
          {pageCount().map((_, index) => {
            return (
              <span
                key={index}
                onClick={() => {
                  setSearchParams(`?page=${index + 1}`);
                }}
                className={
                  searchParams.get('page') * 1 === index + 1
                    ? 'pageNumActive'
                    : 'pageNum'
                }
              >
                {index + 1}
              </span>
            );
          })}
        </Box>
        <Button
          variant='text'
          disabled={searchParams.get('page') * 1 === pageCount().length}
          onClick={() => {
            let currentPage = searchParams.get('page');
            setSearchParams(`?page=${currentPage * 1 + 1}`);
          }}
          sx={{
            color: '#474955',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          Далее
        </Button>
      </Box>
    </Box>
  );
}

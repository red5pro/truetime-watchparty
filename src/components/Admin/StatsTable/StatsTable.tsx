import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Column } from '..'

interface IStatsTableProps {
  tableHead: Column[]
  dataRow: any
}

const StatsTable = ({ tableHead, dataRow }: IStatsTableProps) => {
  /**Keep this for future pagination */
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  /**Keep this for future pagination */

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="table">
          <TableHead>
            <TableRow>
              {tableHead.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: 'rgba(152, 152, 152, 0.6)',
                    position: 'static',
                    borderBottom: 'none',
                    fontWeight: 600,
                    color: ' #cfcbcb',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {dataRow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => { */}
            {dataRow.map((row: any, index: number) => {
              return (
                <TableRow hover tabIndex={-1} key={index}>
                  {tableHead.map((column: any, tindex: number) => {
                    const value = row[column.id]
                    return (
                      <TableCell
                        key={`${index}-${tindex}`}
                        align={column.align}
                        style={{ minWidth: column.minWidth, borderBottom: 'none' }}
                      >
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  )
}

export default StatsTable

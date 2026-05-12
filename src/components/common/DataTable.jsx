import { useMemo, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

const DataTable = ({ title, columns, rows }) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState(columns[0]?.id || "");
  const [order, setOrder] = useState("asc");

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return rows.filter((row) => {
      if (!normalizedSearch) {
        return true;
      }

      return columns.some((column) => {
        const rawValue = row[column.id];
        return String(rawValue ?? "")
          .toLowerCase()
          .includes(normalizedSearch);
      });
    });
  }, [columns, rows, search]);

  const sortedRows = useMemo(() => {
    const copied = [...filteredRows];
    copied.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null) {
        return 1;
      }
      if (bValue == null) {
        return -1;
      }

      const compareResult = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return order === "asc" ? compareResult : -compareResult;
    });
    return copied;
  }, [filteredRows, sortBy, order]);

  const visibleRows = useMemo(
    () => sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRows, page, rowsPerPage]
  );

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(columnId);
    setOrder("asc");
  };

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: alpha(theme.palette.text.secondary, 0.2),
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha("#ffffff", 0.98)
            : alpha("#0b121b", 0.9),
        boxShadow:
          theme.palette.mode === "light"
            ? "0 2px 10px rgba(15, 23, 42, 0.07)"
            : "0 10px 24px rgba(0, 0, 0, 0.28)",
      }}
    >
      <Box sx={{ p: 2.5, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id)}
                    IconComponent={order === "asc" ? ArrowUpwardIcon : ArrowDownwardIcon}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={column.id}>{row[column.id]}</TableCell>
                ))}
              </TableRow>
            ))}
            {!visibleRows.length && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default DataTable;

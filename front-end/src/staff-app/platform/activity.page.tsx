import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Roll } from "shared/models/roll"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  const [getRolls, data, loadState] = useApi<{ activity: Roll[] }>({ url: "get-activities" })

  useEffect(() => {
    void getRolls()
  }, [getRolls])

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: `${Colors.blue.base}`,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell)

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow)

  const useStyles = makeStyles({
    table: {
      minWidth: 500,
    },
  })

  const classes = useStyles()

  const getCount = (transformedArray: any, type: any) => {
    let sum: number = 0
    sum =
      transformedArray?.length > 0 &&
      transformedArray?.reduce((currentValue: number, user: any) => {
        if (user.roll_state === type) {
          return currentValue + 1
        }
        return currentValue
      }, 0)
    console.log("s", transformedArray, type, sum)
    return sum
  }

  console.log(data)
  return (
    <S.Container>
      {data && data.activity.length > 0 ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Roll Id</StyledTableCell>
                <StyledTableCell align="right">Name</StyledTableCell>
                <StyledTableCell align="right">Creation Date</StyledTableCell>
                <StyledTableCell align="right">Present</StyledTableCell>
                <StyledTableCell align="right">Absent</StyledTableCell>
                <StyledTableCell align="right">Late</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.activity.map((row: any) => {
                const date = new Date(row.entity.completed_at)
                return (
                  <TableRow key={row.name}>
                    <StyledTableCell align="right">{row.entity.id}</StyledTableCell>
                    <StyledTableCell align="right">{row.entity.name}</StyledTableCell>
                    <StyledTableCell align="right">{date.toDateString()}</StyledTableCell>
                    <StyledTableCell align="right">{getCount(row.entity.student_roll_states, "present")}</StyledTableCell>
                    <StyledTableCell align="right">{getCount(row.entity.student_roll_states, "absent")}</StyledTableCell>
                    <StyledTableCell align="right">{getCount(row.entity.student_roll_states, "late")}</StyledTableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : data ? (
        <h1>No Rolls Added</h1>
      ) : (
        <h1>Loading Rolls...</h1>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}

import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faSortAmountDownAlt, faSortAmountUpAlt } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortBy, setSortBy] = useState({ type: "", using: "asc" })
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [sortedArray, setSortedArray] = useState(data?.students)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    void setSortedArray(data?.students)
  }, [data])

  useEffect(() => {
    onToolbarAction("sort")
  }, [sortBy])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      if (sortBy?.type === "firstName") {
        if (sortBy.using === "asc") {
          let sortedArrasc =
            data &&
            [...data.students]?.sort(function (a, b) {
              if (a.first_name > b.first_name) {
                return 1
              } else return -1
            })
          setSortedArray(sortedArrasc)
        } else {
          let sortedArrdesc =
            data &&
            [...data.students]?.sort(function (a, b) {
              if (a.first_name > b.first_name) {
                return -1
              } else return 1
            })
          setSortedArray(sortedArrdesc)
        }
      } else if (sortBy?.type === "lastName") {
        if (sortBy.using === "asc") {
          setSortedArray(
            data &&
              [...data.students]?.sort(function (a, b) {
                if (b.last_name > a.last_name) {
                  return -1
                } else return 1
              })
          )
        } else {
          setSortedArray(
            data &&
              [...data?.students]?.sort(function (a, b) {
                if (b.last_name > a.last_name) {
                  return 1
                } else return -1
              })
          )
        }
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortBy={sortBy} setSortBy={setSortBy} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && sortedArray && (
          <>
            {sortedArray.map((s, index) => (
              <StudentListTile key={index} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortBy: any
  setSortBy: any
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortBy, setSortBy } = props
  const sortSelect = {
    color: `${Colors.neutral.base}`,
    backgroundColor: `${Colors.blue.base}`,
  }

  const sortByUsing = {
    margin: `0 ${Spacing.u2}`,
  }

  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>
        <label htmlFor="names">Sort By: </label>
        <select style={sortSelect} id="names" name="names" value={sortBy.type} onChange={(event) => setSortBy((sortObj: any) => ({ ...sortObj, type: event.target.value }))}>
          <option value="" defaultValue="true" hidden>
            None
          </option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
        </select>

        {sortBy.using === "asc" ? (
          <FontAwesomeIcon style={sortByUsing} onClick={(event) => (setSortBy({ ...sortBy, using: "desc" }), event.stopPropagation())} icon={faSortAmountDownAlt} />
        ) : (
          <FontAwesomeIcon style={sortByUsing} onClick={(event) => (setSortBy({ ...sortBy, using: "asc" }), event.stopPropagation())} icon={faSortAmountUpAlt} />
        )}
      </div>
      <div>Search</div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}

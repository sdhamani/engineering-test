import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"

interface Props {
  stateList: StateList[]
  onItemClick?: (type: ItemType) => void
  size?: number
  setTransformedArray: any
  data: any
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, onItemClick, data, setTransformedArray }) => {
  const onClick = (type: ItemType) => {
    if (onItemClick) {
      onItemClick(type)
    }
    if (type !== "all") {
      setTransformedArray((transformedArray: any) =>
        transformedArray.map((student: any) => {
          if (student.status === type) return { ...student, visibility: true }
          else return { ...student, visibility: false }
        })
      )
    } else {
      setTransformedArray((transformedArray: any) =>
        transformedArray.map((student: any) => {
          return { ...student, visibility: true }
        })
      )
    }
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"

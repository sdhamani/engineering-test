import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { saveActiveRoll } from "api/save-active-roll"
import { useNavigate } from "react-router"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  transformedArray: any
  setTransformedArray: any
  data: any
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { isActive, onItemClick, transformedArray, data, setTransformedArray } = props

  const getCount = (type: any) => {
    let sum: number = 0
    sum =
      transformedArray?.length > 0 &&
      transformedArray?.reduce((currentValue: number, user: any) => {
        if (user.status === type) {
          return currentValue + 1
        }
        return currentValue
      }, 0)
    return sum
  }

  const submitRoll = () => {
    const rollInput = transformedArray.map((student: any) => {
      return { student_id: student.id, roll_state: student.status }
    })
    saveActiveRoll({
      student_roll_states: rollInput,
    })
    navigate("/staff/activity")
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: transformedArray?.length },
              { type: "present", count: getCount("present") },
              { type: "late", count: getCount("late") },
              { type: "absent", count: getCount("absent") },
            ]}
            data={data}
            setTransformedArray={setTransformedArray}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => submitRoll()}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}

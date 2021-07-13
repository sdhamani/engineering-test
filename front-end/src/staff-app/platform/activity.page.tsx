import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"

export const ActivityPage: React.FC = () => {
  const [getRolls, data, loadState] = useApi<{ students: Person[] }>({ url: "get-activities" })

  useEffect(() => {
    void getRolls()
  }, [getRolls])

  return <S.Container>Activity Page</S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}

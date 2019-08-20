import { SkinElementLike } from "../types/SkinElementLike"
import { ImageElement } from "../../imagery/classes/ImageElement"
import React from "react"
import { styled } from "../../theming/themes"
import { getColor } from "../../theming/helpers"
import { cover, ellipsis } from "polished"
import { ImagePreview } from "../../imagery/components/ImagePreview"
import { humanizeFilename } from "../helpers/humanizeFilename"

export interface SkinElementItemProps {
  element: SkinElementLike
}

const Container = styled.li`
  background: ${getColor("primary")};
  border-radius: 3px;

  display: flex;
  flex-direction: column;

  position: relative;
  overflow: hidden;

  box-shadow: 9px 8px 9px -9px rgba(0, 0, 0, 0.51);
`

const Content = styled.div`
  position: relative;

  width: 100%;
  padding-bottom: 100%;

  overflow: hidden;

  display: flex;
  align-items: center;
`

const Image = styled(ImagePreview)`
  ${cover()}
`

const PrimaryInfo = styled.div`
  padding: 16px;

  font-size: 0.8em;
  font-weight: 600;

  ${ellipsis()}
`

export function SkinElementItem(props: SkinElementItemProps) {
  const { element } = props

  const renderContent = () => {
    if (element instanceof ImageElement) {
      const { path } = element

      return <Image src={path} />
    }
  }

  return (
    <Container>
      <Content>{renderContent()}</Content>
      <PrimaryInfo>{humanizeFilename(element.name)}</PrimaryInfo>
    </Container>
  )
}

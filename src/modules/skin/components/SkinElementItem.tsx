import { SkinElementLike } from "../types/SkinElementLike"
import { ImageElement } from "../../imagery/classes/ImageElement"
import React from "react"
import { styled } from "../../theming/themes"
import { getColor } from "../../theming/helpers"
import { cover, ellipsis } from "polished"
import { ImagePreview } from "../../imagery/components/ImagePreview"
import { humanizeFilename } from "../helpers/humanizeFilename"
import { ImageElementThumbnail } from "../../imagery/components/ImageElementThumbnail"

export interface SkinElementItemProps {
  element: SkinElementLike
  onClick?: () => void
  active?: boolean
}

const Container = styled.li<{ active?: boolean }>`
  background: ${getColor("primary")};

  display: flex;
  flex-direction: column;

  position: relative;
  overflow: hidden;

  border: solid 1px transparent;

  ${props =>
    props.active
      ? `
    border-color: ${props.theme.colors.accent};
  `
      : `
    &:hover {
      cursor: pointer;
      border-color: ${props.theme.transparencies.negative};
    }
  `}
`

const Content = styled.div`
  position: relative;

  width: 100%;
  padding-bottom: 100%;

  overflow: hidden;

  display: flex;
  align-items: center;
`

const Image = styled(ImageElementThumbnail)`
  ${cover()}
`

const PrimaryInfo = styled.div`
  padding: 16px;

  font-size: 0.8em;
  font-weight: 600;

  ${ellipsis()}
`

export function SkinElementItem(props: SkinElementItemProps) {
  const { element, onClick, active } = props

  const renderContent = () => {
    if (element instanceof ImageElement) {
      return <Image element={element} />
    }
  }

  return (
    <Container active={active} onClick={onClick}>
      <Content>{renderContent()}</Content>
      <PrimaryInfo>{humanizeFilename(element.displayName)}</PrimaryInfo>
    </Container>
  )
}

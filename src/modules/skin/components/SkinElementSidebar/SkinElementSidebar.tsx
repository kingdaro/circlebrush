import React from "react"
import { ImageElement } from "../../../imagery/classes/ImageElement"
import { ImageElementThumbnail } from "../../../imagery/components/ImageElementThumbnail"
import { getColor } from "../../../theming/helpers"
import { styled } from "../../../theming/themes"
import { SkinElementLike } from "../../types/SkinElementLike"
import { PrimaryActions } from "./PrimaryActions"
import { PrimaryInfo } from "./PrimaryInfo"

export type SkinElementSidebarProps = {
  element: SkinElementLike
}

const Container = styled.div`
  background: ${getColor("primary")};
  width: 380px;
  flex-shrink: 0;
`

const Sections = styled.div`
  margin-top: 32px;
  padding: 0px 32px;
`

const Image = styled(ImageElementThumbnail)`
  height: 350px;
`

const Divider = styled.div`
  height: 1px;
  width: 100%;

  background: ${getColor("divider")};
  margin: 16px 0px;
`

export function SkinElementSidebar(props: SkinElementSidebarProps) {
  const { element } = props

  const renderPreview = () => {
    if (element instanceof ImageElement) {
      return <Image element={element} />
    }
  }

  const renderActions = () => {
    if (element instanceof ImageElement) {
      return <PrimaryActions element={element} />
    }
  }

  return (
    <Container>
      {renderPreview()}
      <Sections>
        <PrimaryInfo element={element} />
        <Divider />
        {renderActions()}
      </Sections>
    </Container>
  )
}

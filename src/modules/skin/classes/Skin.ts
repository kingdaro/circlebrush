import { SkinConfiguration, SkinConfigurationData } from "./SkinConfiguration"
import { promises as fs } from "fs"
import * as path from "path"
import { SkinElementLike } from "../types/SkinElementLike"
import { ImageElement } from "../../imagery/classes/ImageElement"
import { FSWatcher } from "chokidar"
import { createSkinWatcher } from "../helpers/createSkinWatcher"
import { getStrippedFilename } from "../../../common/lang/string/getStrippedFilename"

export interface SkinOptions {
  config: SkinConfiguration
  elements: SkinElementLike[]
  temp: string
}

export interface SerializedSkin {
  config: SkinConfigurationData
  elements: string[]
}

/** Represents a skin */
export class Skin {
  public static async createFromPath(dir: string, temp: string) {
    const files = await fs.readdir(dir)
    const paths = files.map(f => path.join(dir, f))

    const iniName = files.find(x => x === "skin.ini")
    if (!iniName) throw new Error("A skin.ini file was not found")

    const config = await SkinConfiguration.createFromPath(path.join(dir, iniName), temp)
    const elements = await ImageElement.createFromPathList(paths, { temp })

    return new Skin({
      config,
      elements,
      temp,
    })
  }

  public static async createFromHydration(data: SerializedSkin, temp: string) {
    const config = new SkinConfiguration(data.config)
    const elements = await ImageElement.createFromPathList(data.elements, { temp })

    return new Skin({
      config,
      elements,
      temp,
    })
  }

  public config: SkinConfiguration
  public elements: SkinElementLike[]

  private watcher?: FSWatcher
  private temp: string

  constructor(options: SkinOptions) {
    const { config, elements, temp } = options

    this.config = config
    this.elements = elements
    this.temp = temp
  }

  public watch() {
    if (this.watcher) {
      throw new Error("A watcher already exists!")
    }

    const watcher = (this.watcher = createSkinWatcher(this.temp))

    watcher.on("change", file => {
      const name = getStrippedFilename(file)
      const element = this.getElementByName(name)

      if (element) element.updatePreview()
    })
  }

  public getElementByName(name: string) {
    const element = this.elements.find(element => element.name === name)
    if (element) return element

    return this.elements.find(element => element.alias === name)
  }

  public serialize(): SerializedSkin {
    return {
      config: this.config.data,
      elements: this.elements.map(element => element.path),
    }
  }
}
